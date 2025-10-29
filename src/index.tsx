// ============================================
// Main Application Entry Point
// نظام إدارة الشركات المتكامل (ERP)
// ============================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/cloudflare-workers';

// Import routes
import auth from './routes/auth';
import users from './routes/users';
import dashboard from './routes/dashboard';
import departments from './routes/departments';
import allModules from './routes/all-modules';

import type { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
app.use('*', logger());
app.use('/api/*', cors());

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// API Routes
app.route('/api/auth', auth);
app.route('/api/users', users);
app.route('/api/dashboard', dashboard);
app.route('/api/departments', departments);
app.route('/api', allModules);

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    success: true, 
    message: 'نظام إدارة الشركات المتكامل يعمل بنجاح',
    timestamp: new Date().toISOString() 
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
    </head>
    <body>
        <div id="app"></div>
        
        <!-- JavaScript Files -->
        <script src="/static/app-enhanced.js"></script>
        <script src="/static/app-rendering.js"></script>
        <script src="/static/app-forms.js"></script>
    </body>
    </html>
  `);
});

export default app;
