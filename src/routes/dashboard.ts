// ============================================
// Dashboard Routes
// ============================================

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Bindings, Variables, DashboardStats } from '../types';

const dashboard = new Hono<{ Bindings: Bindings; Variables: Variables }>();

dashboard.use('/*', authMiddleware);

// Get dashboard statistics
dashboard.get('/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    // Get total clients
    const clientsResult = await db
      .prepare('SELECT COUNT(*) as total FROM clients WHERE is_active = 1')
      .first<{ total: number }>();
    
    // Get total suppliers
    const suppliersResult = await db
      .prepare('SELECT COUNT(*) as total FROM suppliers WHERE is_active = 1')
      .first<{ total: number }>();
    
    // Get total employees
    const employeesResult = await db
      .prepare('SELECT COUNT(*) as total FROM employees WHERE is_active = 1')
      .first<{ total: number }>();
    
    // Get invoices statistics
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
    
    // Get revenue and expenses from journal entries
    const financialStatsResult = await db
      .prepare(`
        SELECT 
          SUM(CASE WHEN a.account_type = 'revenue' THEN jel.credit ELSE 0 END) as total_revenue,
          SUM(CASE WHEN a.account_type = 'expense' THEN jel.debit ELSE 0 END) as total_expenses
        FROM journal_entry_lines jel
        JOIN accounts a ON jel.account_id = a.id
        JOIN journal_entries je ON jel.journal_entry_id = je.id
        WHERE je.status = 'posted'
      `)
      .first<any>();
    
    const stats: DashboardStats = {
      totalRevenue: financialStatsResult?.total_revenue || 0,
      totalExpenses: financialStatsResult?.total_expenses || 0,
      netProfit: (financialStatsResult?.total_revenue || 0) - (financialStatsResult?.total_expenses || 0),
      totalClients: clientsResult?.total || 0,
      totalSuppliers: suppliersResult?.total || 0,
      totalEmployees: employeesResult?.total || 0,
      pendingInvoices: invoicesStatsResult?.pending_invoices || 0,
      overdueInvoices: invoicesStatsResult?.overdue_invoices || 0,
      totalInvoicesAmount: invoicesStatsResult?.total_amount || 0,
      paidInvoicesAmount: invoicesStatsResult?.paid_amount || 0,
    };
    
    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم' }, 500);
  }
});

// Get recent activities
dashboard.get('/activities', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const db = c.env.DB;
    
    const result = await db
      .prepare(`
        SELECT 
          al.*,
          u.full_name as user_name
        FROM audit_logs al
        JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT ?
      `)
      .bind(limit)
      .all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    console.error('Get activities error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب الأنشطة الأخيرة' }, 500);
  }
});

// Get notifications
dashboard.get('/notifications', async (c) => {
  try {
    const user = c.get('user');
    const limit = parseInt(c.req.query('limit') || '10');
    const db = c.env.DB;
    
    const result = await db
      .prepare(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `)
      .bind(user!.id, limit)
      .all();
    
    return c.json({ success: true, data: result.results });
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
