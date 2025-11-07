// ============================================
// Dashboard Routes
// ============================================

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Bindings, Variables, DashboardStats } from '../types';

const dashboard = new Hono<{ Bindings: Bindings; Variables: Variables }>();

dashboard.use('/*', authMiddleware);

// Get dashboard statistics (with optimized queries)
dashboard.get('/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    // استخدام استعلام واحد محسّن بدلاً من استعلامات متعددة
    // Using single optimized query instead of multiple queries
    const basicStatsResult = await db
      .prepare(`
        SELECT 
          (SELECT COUNT(*) FROM clients WHERE is_active = 1) as total_clients,
          (SELECT COUNT(*) FROM suppliers WHERE is_active = 1) as total_suppliers,
          (SELECT COUNT(*) FROM employees WHERE is_active = 1) as total_employees
      `)
      .first<any>();
    
    // Get invoices statistics (optimized with indexes)
    const invoicesStatsResult = await db
      .prepare(`
        SELECT 
          COUNT(*) as total_invoices,
          SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) as pending_invoices,
          SUM(CASE WHEN payment_status = 'unpaid' AND due_date < date('now') THEN 1 ELSE 0 END) as overdue_invoices,
          SUM(total_amount) as total_amount,
          SUM(paid_amount) as paid_amount
        FROM invoices
        WHERE status != 'cancelled'
      `)
      .first<any>();
    
    // Get revenue and expenses (optimized with indexes)
    const financialStatsResult = await db
      .prepare(`
        SELECT 
          SUM(CASE WHEN a.account_type = 'revenue' THEN jel.credit ELSE 0 END) as total_revenue,
          SUM(CASE WHEN a.account_type = 'expense' THEN jel.debit ELSE 0 END) as total_expenses
        FROM journal_entry_lines jel
        INNER JOIN accounts a ON jel.account_id = a.id
        INNER JOIN journal_entries je ON jel.journal_entry_id = je.id
        WHERE je.status = 'posted'
      `)
      .first<any>();
    
    const stats: DashboardStats = {
      totalRevenue: financialStatsResult?.total_revenue || 0,
      totalExpenses: financialStatsResult?.total_expenses || 0,
      netProfit: (financialStatsResult?.total_revenue || 0) - (financialStatsResult?.total_expenses || 0),
      totalClients: basicStatsResult?.total_clients || 0,
      totalSuppliers: basicStatsResult?.total_suppliers || 0,
      totalEmployees: basicStatsResult?.total_employees || 0,
      pendingInvoices: invoicesStatsResult?.pending_invoices || 0,
      overdueInvoices: invoicesStatsResult?.overdue_invoices || 0,
      totalInvoicesAmount: invoicesStatsResult?.total_amount || 0,
      paidInvoicesAmount: invoicesStatsResult?.paid_amount || 0,
    };
    
    // إضافة cache control headers
    c.header('Cache-Control', 'private, max-age=60'); // Cache for 1 minute
    
    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم' }, 500);
  }
});

// Get recent activities (with pagination support)
dashboard.get('/activities', async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50); // Max 50 records
    const offset = parseInt(c.req.query('offset') || '0');
    const db = c.env.DB;
    
    // استعلام محسّن مع INNER JOIN
    const result = await db
      .prepare(`
        SELECT 
          al.id,
          al.action,
          al.module,
          al.record_id,
          al.created_at,
          u.full_name as user_name
        FROM audit_logs al
        INNER JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all();
    
    // Cache for 30 seconds
    c.header('Cache-Control', 'private, max-age=30');
    
    return c.json({ 
      success: true, 
      data: result.results,
      pagination: {
        limit,
        offset,
        hasMore: result.results.length === limit
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب الأنشطة الأخيرة' }, 500);
  }
});

// Get notifications (with pagination and unread filter)
dashboard.get('/notifications', async (c) => {
  try {
    const user = c.get('user');
    const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50);
    const offset = parseInt(c.req.query('offset') || '0');
    const unreadOnly = c.req.query('unread') === 'true';
    const db = c.env.DB;
    
    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `;
    
    const params: any[] = [user!.id];
    
    if (unreadOnly) {
      query += ' AND is_read = 0';
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const result = await db
      .prepare(query)
      .bind(...params)
      .all();
    
    // Get unread count
    const unreadCountResult = await db
      .prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0')
      .bind(user!.id)
      .first<{ count: number }>();
    
    // No cache for notifications (real-time data)
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return c.json({ 
      success: true, 
      data: result.results,
      unreadCount: unreadCountResult?.count || 0,
      pagination: {
        limit,
        offset,
        hasMore: result.results.length === limit
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب الإشعارات' }, 500);
  }
});

// Mark notification as read
dashboard.put('/notifications/:id/read', async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user');
    const db = c.env.DB;
    
    await db
      .prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?')
      .bind(id, user!.id)
      .run();
    
    return c.json({ success: true, message: 'تم وضع علامة مقروء على الإشعار' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء تحديث الإشعار' }, 500);
  }
});

export default dashboard;
