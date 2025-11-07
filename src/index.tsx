// ============================================
// Main Application Entry Point
// نظام إدارة الشركات المتكامل (ERP)
// ============================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { compress } from 'hono/compress';
import { cache } from 'hono/cache';
import { serveStatic } from 'hono/cloudflare-workers';

// Import routes
import auth from './routes/auth';
import users from './routes/users';
import dashboard from './routes/dashboard';
import departments from './routes/departments';
import allModules from './routes/all-modules';

import type { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Performance Middleware
app.use('*', compress({
  encoding: 'gzip'
}));

// Logging Middleware
app.use('*', logger());

// CORS Middleware
app.use('/api/*', cors());

// Cache Middleware for Static Assets
app.use('/static/*', cache({
  cacheName: 'static-assets-v1',
  cacheControl: 'public, max-age=31536000, immutable' // 1 year
}));

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// API Routes
app.route('/api/auth', auth);
app.route('/api/users', users);
app.route('/api/dashboard', dashboard);
app.route('/api/departments', departments);
app.route('/api', allModules);

// Performance Headers Middleware
app.use('*', async (c, next) => {
  await next();
  
  // Security Headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance Headers
  c.header('X-DNS-Prefetch-Control', 'on');
  
  // Cache control for HTML
  if (c.req.path === '/' || c.req.path.endsWith('.html')) {
    c.header('Cache-Control', 'no-cache, must-revalidate');
  }
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    success: true, 
    message: 'نظام إدارة الشركات المتكامل يعمل بنجاح',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    memory: process.memoryUsage ? {
      used: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.floor(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    } : null
  });
});

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl" data-theme="light">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="نظام إدارة الشركات المتكامل - ERP System">
        <title>نظام إدارة الشركات المتكامل - ERP</title>
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Font Awesome -->
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        
        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        
        <!-- SheetJS for Excel Export -->
        <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
        
        <!-- jsPDF for PDF Export -->
        <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
        
        <!-- html2canvas for HTML to Canvas -->
        <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
        
        <!-- Axios -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <!-- Custom Styles -->
        <link href="/static/styles-enhanced.css" rel="stylesheet">
        <link href="/static/styles-login.css" rel="stylesheet">
        <link href="/static/styles-responsive.css" rel="stylesheet">
    </head>
    <body>
        <div id="app"></div>
        
        <!-- Performance Optimization Modules - Load First -->
        <script src="/static/performance-optimization.js"></script>
        <script src="/static/module-loader.js"></script>
        <script src="/static/app-dashboard-optimized.js"></script>
        
        <!-- Service Worker Registration -->
        <script src="/static/sw-register.js"></script>
        
        <!-- JavaScript Files -->
        <script src="/static/app-enhanced.js"></script>
        <script src="/static/app-login-enhanced.js"></script>
        <script src="/static/app-rendering.js"></script>
        <script src="/static/app-forms.js"></script>
    </body>
    </html>
  `);
});

export default app;
