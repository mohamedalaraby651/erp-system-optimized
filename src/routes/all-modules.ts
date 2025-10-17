// ============================================
// All Modules Routes - Comprehensive API
// ============================================

import { Hono } from 'hono';
import { authMiddleware, checkPermission } from '../middleware/auth';
import { getCurrentDateTime, getCurrentDate, buildPaginationClause, generateCode } from '../utils/db';
import type { Bindings, Variables } from '../types';

const api = new Hono<{ Bindings: Bindings; Variables: Variables }>();

api.use('/*', authMiddleware);

// ============================================
// EMPLOYEES ROUTES
// ============================================

api.get('/employees', checkPermission('employees', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    const result = await db.prepare(`
      SELECT e.*, d.name as department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.is_active = 1
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const count = await db.prepare('SELECT COUNT(*) as total FROM employees WHERE is_active = 1').first<any>();
    
    return c.json({
      success: true,
      data: result.results,
      pagination: { page, limit, total: count?.total || 0, totalPages: Math.ceil((count?.total || 0) / limit) }
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب الموظفين' }, 500);
  }
});

api.post('/employees', checkPermission('employees', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    
    // Generate employee code
    const lastEmp = await db.prepare('SELECT employee_code FROM employees ORDER BY id DESC LIMIT 1').first<any>();
    const lastNum = lastEmp ? parseInt(lastEmp.employee_code.split('-')[1]) : 0;
    const empCode = generateCode('EMP-', lastNum);
    
    const result = await db.prepare(`
      INSERT INTO employees (employee_code, full_name, full_name_ar, email, phone, national_id, 
        date_of_birth, gender, address, department_id, position, position_ar, hire_date, 
        contract_type, salary, bank_account, emergency_contact, emergency_phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      empCode, data.full_name, data.full_name_ar || null, data.email || null, data.phone,
      data.national_id || null, data.date_of_birth || null, data.gender || null, data.address || null,
      data.department_id || null, data.position, data.position_ar || null, data.hire_date,
      data.contract_type || 'full-time', data.salary, data.bank_account || null,
      data.emergency_contact || null, data.emergency_phone || null,
      getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة الموظف بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة الموظف' }, 500);
  }
});

api.put('/employees/:id', checkPermission('employees', 'update'), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json<any>();
    const db = c.env.DB;
    
    await db.prepare(`
      UPDATE employees SET full_name = ?, full_name_ar = ?, email = ?, phone = ?,
        department_id = ?, position = ?, position_ar = ?, salary = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      data.full_name, data.full_name_ar, data.email, data.phone,
      data.department_id, data.position, data.position_ar, data.salary,
      getCurrentDateTime(), id
    ).run();
    
    return c.json({ success: true, message: 'تم تحديث الموظف بنجاح' });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في تحديث الموظف' }, 500);
  }
});

// ============================================
// CLIENTS ROUTES
// ============================================

api.get('/clients', checkPermission('clients', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    const result = await db.prepare(`
      SELECT c.*, u.full_name as account_manager_name
      FROM clients c
      LEFT JOIN users u ON c.account_manager_id = u.id
      WHERE c.is_active = 1
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const count = await db.prepare('SELECT COUNT(*) as total FROM clients WHERE is_active = 1').first<any>();
    
    return c.json({
      success: true,
      data: result.results,
      pagination: { page, limit, total: count?.total || 0, totalPages: Math.ceil((count?.total || 0) / limit) }
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب العملاء' }, 500);
  }
});

api.post('/clients', checkPermission('clients', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    
    const lastClient = await db.prepare('SELECT client_code FROM clients ORDER BY id DESC LIMIT 1').first<any>();
    const lastNum = lastClient ? parseInt(lastClient.client_code.split('-')[1]) : 0;
    const clientCode = generateCode('CL-', lastNum);
    
    const result = await db.prepare(`
      INSERT INTO clients (client_code, name, name_ar, company_name, company_name_ar, tax_number,
        email, phone, mobile, address, city, country, client_type, credit_limit, payment_terms,
        discount_percentage, account_manager_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      clientCode, data.name, data.name_ar || null, data.company_name || null,
      data.company_name_ar || null, data.tax_number || null, data.email || null, data.phone,
      data.mobile || null, data.address || null, data.city || null, data.country || 'Egypt',
      data.client_type || 'individual', data.credit_limit || 0, data.payment_terms || 30,
      data.discount_percentage || 0, data.account_manager_id || null,
      getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة العميل بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة العميل' }, 500);
  }
});

// ============================================
// SUPPLIERS ROUTES
// ============================================

api.get('/suppliers', checkPermission('suppliers', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    const result = await db.prepare(`
      SELECT * FROM suppliers WHERE is_active = 1
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const count = await db.prepare('SELECT COUNT(*) as total FROM suppliers WHERE is_active = 1').first<any>();
    
    return c.json({
      success: true,
      data: result.results,
      pagination: { page, limit, total: count?.total || 0, totalPages: Math.ceil((count?.total || 0) / limit) }
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب الموردين' }, 500);
  }
});

api.post('/suppliers', checkPermission('suppliers', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    
    const lastSupplier = await db.prepare('SELECT supplier_code FROM suppliers ORDER BY id DESC LIMIT 1').first<any>();
    const lastNum = lastSupplier ? parseInt(lastSupplier.supplier_code.split('-')[1]) : 0;
    const supplierCode = generateCode('SUP-', lastNum);
    
    const result = await db.prepare(`
      INSERT INTO suppliers (supplier_code, name, name_ar, company_name, company_name_ar,
        tax_number, email, phone, mobile, address, city, country, payment_terms, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      supplierCode, data.name, data.name_ar || null, data.company_name,
      data.company_name_ar || null, data.tax_number || null, data.email || null, data.phone,
      data.mobile || null, data.address || null, data.city || null, data.country || 'Egypt',
      data.payment_terms || 30, getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة المورد بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة المورد' }, 500);
  }
});

// ============================================
// INVOICES ROUTES
// ============================================

api.get('/invoices', checkPermission('invoices', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const type = c.req.query('type') || 'all';
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    let query = `
      SELECT i.*, 
        CASE WHEN i.invoice_type = 'sales' THEN c.name ELSE s.name END as party_name,
        u.full_name as created_by_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      LEFT JOIN users u ON i.created_by = u.id
      WHERE i.status != 'cancelled'
    `;
    
    if (type !== 'all') {
      query += ` AND i.invoice_type = '${type}'`;
    }
    
    query += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
    
    const result = await db.prepare(query).bind(limit, offset).all();
    const count = await db.prepare(`SELECT COUNT(*) as total FROM invoices WHERE status != 'cancelled'`).first<any>();
    
    return c.json({
      success: true,
      data: result.results,
      pagination: { page, limit, total: count?.total || 0, totalPages: Math.ceil((count?.total || 0) / limit) }
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب الفواتير' }, 500);
  }
});

api.post('/invoices', checkPermission('invoices', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    const user = c.get('user');
    
    // Generate invoice number
    const prefix = data.invoice_type === 'sales' ? 'INV-S-' : 'INV-P-';
    const lastInv = await db.prepare(
      `SELECT invoice_number FROM invoices WHERE invoice_type = ? ORDER BY id DESC LIMIT 1`
    ).bind(data.invoice_type).first<any>();
    const lastNum = lastInv ? parseInt(lastInv.invoice_number.split('-')[2]) : 0;
    const invoiceNumber = generateCode(prefix, lastNum);
    
    // Calculate totals
    const subtotal = parseFloat(data.subtotal);
    const taxAmount = subtotal * (parseFloat(data.tax_rate || 14) / 100);
    const discountAmount = parseFloat(data.discount_amount || 0);
    const totalAmount = subtotal + taxAmount - discountAmount;
    
    const result = await db.prepare(`
      INSERT INTO invoices (invoice_number, invoice_type, invoice_date, due_date, client_id, supplier_id,
        subtotal, tax_amount, discount_amount, total_amount, balance, payment_status, currency,
        notes, terms, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 'EGP', ?, ?, ?, ?, ?)
    `).bind(
      invoiceNumber, data.invoice_type, data.invoice_date, data.due_date,
      data.client_id || null, data.supplier_id || null,
      subtotal, taxAmount, discountAmount, totalAmount, totalAmount,
      data.notes || null, data.terms || null, user!.id,
      getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    // Insert invoice items
    if (data.items && data.items.length > 0) {
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        await db.prepare(`
          INSERT INTO invoice_items (invoice_id, item_number, description, quantity, unit_price,
            tax_rate, discount_rate, line_total, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          result.meta.last_row_id, i + 1, item.description, item.quantity, item.unit_price,
          item.tax_rate || 0, item.discount_rate || 0, item.line_total,
          getCurrentDateTime()
        ).run();
      }
    }
    
    return c.json({ 
      success: true, 
      message: 'تم إنشاء الفاتورة بنجاح',
      data: { id: result.meta.last_row_id, invoice_number: invoiceNumber }
    }, 201);
  } catch (error) {
    console.error('Invoice error:', error);
    return c.json({ success: false, error: 'خطأ في إنشاء الفاتورة' }, 500);
  }
});

// ============================================
// INVENTORY ROUTES
// ============================================

api.get('/inventory', checkPermission('inventory', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    const result = await db.prepare(`
      SELECT i.*, s.name as supplier_name
      FROM inventory_items i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      WHERE i.is_active = 1
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const count = await db.prepare('SELECT COUNT(*) as total FROM inventory_items WHERE is_active = 1').first<any>();
    
    return c.json({
      success: true,
      data: result.results,
      pagination: { page, limit, total: count?.total || 0, totalPages: Math.ceil((count?.total || 0) / limit) }
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب المخزون' }, 500);
  }
});

api.post('/inventory', checkPermission('inventory', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    
    const lastItem = await db.prepare('SELECT item_code FROM inventory_items ORDER BY id DESC LIMIT 1').first<any>();
    const lastNum = lastItem ? parseInt(lastItem.item_code.split('-')[1]) : 0;
    const itemCode = generateCode('ITM-', lastNum);
    
    const result = await db.prepare(`
      INSERT INTO inventory_items (item_code, item_name, item_name_ar, description, category,
        unit, unit_ar, quantity, reorder_level, unit_cost, selling_price, supplier_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      itemCode, data.item_name, data.item_name_ar || null, data.description || null,
      data.category || null, data.unit, data.unit_ar || null, data.quantity || 0,
      data.reorder_level || 0, data.unit_cost, data.selling_price,
      data.supplier_id || null, getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة الصنف بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة الصنف' }, 500);
  }
});

// ============================================
// PAYROLL & ATTENDANCE ROUTES
// ============================================

api.get('/attendance', checkPermission('hr', 'read'), async (c) => {
  try {
    const date = c.req.query('date') || getCurrentDate();
    const db = c.env.DB;
    
    const result = await db.prepare(`
      SELECT a.*, e.full_name as employee_name, e.employee_code
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.attendance_date = ?
      ORDER BY e.employee_code
    `).bind(date).all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب سجلات الحضور' }, 500);
  }
});

api.post('/attendance', checkPermission('hr', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    
    await db.prepare(`
      INSERT OR REPLACE INTO attendance (employee_id, attendance_date, check_in, check_out,
        total_hours, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.employee_id, data.attendance_date, data.check_in || null, data.check_out || null,
      data.total_hours || null, data.status || 'present', data.notes || null,
      getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم تسجيل الحضور بنجاح' });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في تسجيل الحضور' }, 500);
  }
});

api.get('/payroll', checkPermission('hr', 'read'), async (c) => {
  try {
    const month = c.req.query('month');
    const db = c.env.DB;
    
    let query = `
      SELECT p.*, e.full_name as employee_name, e.employee_code
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
    `;
    
    if (month) {
      query += ` WHERE strftime('%Y-%m', p.pay_period_start) = ?`;
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    const result = month 
      ? await db.prepare(query).bind(month).all()
      : await db.prepare(query).all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب سجلات الرواتب' }, 500);
  }
});

api.post('/payroll', checkPermission('hr', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    const user = c.get('user');
    
    const netSalary = parseFloat(data.basic_salary) + parseFloat(data.allowances || 0) + 
                      parseFloat(data.bonuses || 0) - parseFloat(data.deductions || 0) - 
                      parseFloat(data.tax || 0) - parseFloat(data.insurance || 0);
    
    const result = await db.prepare(`
      INSERT INTO payroll (employee_id, pay_period_start, pay_period_end, basic_salary,
        allowances, bonuses, deductions, tax, insurance, net_salary, payment_date,
        payment_method, notes, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.employee_id, data.pay_period_start, data.pay_period_end, data.basic_salary,
      data.allowances || 0, data.bonuses || 0, data.deductions || 0,
      data.tax || 0, data.insurance || 0, netSalary, data.payment_date || null,
      data.payment_method || null, data.notes || null, user!.id,
      getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة سجل الرواتب بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة سجل الرواتب' }, 500);
  }
});

// ============================================
// CRM ROUTES
// ============================================

api.get('/crm/interactions', checkPermission('clients', 'read'), async (c) => {
  try {
    const clientId = c.req.query('client_id');
    const db = c.env.DB;
    
    const query = clientId
      ? `SELECT i.*, c.name as client_name, u.full_name as handled_by_name
         FROM client_interactions i
         JOIN clients c ON i.client_id = c.id
         JOIN users u ON i.handled_by = u.id
         WHERE i.client_id = ?
         ORDER BY i.interaction_date DESC`
      : `SELECT i.*, c.name as client_name, u.full_name as handled_by_name
         FROM client_interactions i
         JOIN clients c ON i.client_id = c.id
         JOIN users u ON i.handled_by = u.id
         ORDER BY i.interaction_date DESC
         LIMIT 50`;
    
    const result = clientId 
      ? await db.prepare(query).bind(clientId).all()
      : await db.prepare(query).all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب التفاعلات' }, 500);
  }
});

api.post('/crm/interactions', checkPermission('clients', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    const user = c.get('user');
    
    const result = await db.prepare(`
      INSERT INTO client_interactions (client_id, interaction_type, interaction_date, subject,
        description, outcome, next_action, next_action_date, handled_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.client_id, data.interaction_type, data.interaction_date, data.subject,
      data.description || null, data.outcome || null, data.next_action || null,
      data.next_action_date || null, user!.id, getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة التفاعل بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة التفاعل' }, 500);
  }
});

api.get('/crm/opportunities', checkPermission('clients', 'read'), async (c) => {
  try {
    const status = c.req.query('status') || 'open';
    const db = c.env.DB;
    
    const result = await db.prepare(`
      SELECT o.*, c.name as client_name, u.full_name as assigned_to_name
      FROM opportunities o
      JOIN clients c ON o.client_id = c.id
      JOIN users u ON o.assigned_to = u.id
      WHERE o.status = ?
      ORDER BY o.expected_close_date
    `).bind(status).all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب الفرص البيعية' }, 500);
  }
});

api.post('/crm/opportunities', checkPermission('clients', 'create'), async (c) => {
  try {
    const data = await c.req.json<any>();
    const db = c.env.DB;
    const user = c.get('user');
    
    const result = await db.prepare(`
      INSERT INTO opportunities (opportunity_name, client_id, estimated_value, probability,
        expected_close_date, stage, description, assigned_to, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.opportunity_name, data.client_id, data.estimated_value, data.probability || 50,
      data.expected_close_date || null, data.stage || 'lead', data.description || null,
      data.assigned_to || user!.id, getCurrentDateTime(), getCurrentDateTime()
    ).run();
    
    return c.json({ success: true, message: 'تم إضافة الفرصة البيعية بنجاح', data: { id: result.meta.last_row_id } }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة الفرصة البيعية' }, 500);
  }
});

// ============================================
// REPORTS ROUTES
// ============================================

api.get('/reports/financial', checkPermission('reports', 'read'), async (c) => {
  try {
    const type = c.req.query('type') || 'income';
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const db = c.env.DB;
    
    let query = '';
    
    if (type === 'income') {
      query = `
        SELECT a.account_name, a.account_name_ar, SUM(jel.credit - jel.debit) as amount
        FROM journal_entry_lines jel
        JOIN accounts a ON jel.account_id = a.id
        JOIN journal_entries je ON jel.journal_entry_id = je.id
        WHERE a.account_type = 'revenue' AND je.status = 'posted'
      `;
    } else if (type === 'balance') {
      query = `
        SELECT a.account_name, a.account_name_ar, a.account_type, a.current_balance
        FROM accounts a
        WHERE a.is_active = 1
      `;
    }
    
    if (startDate && endDate && type === 'income') {
      query += ` AND je.entry_date BETWEEN ? AND ?`;
    }
    
    query += ` GROUP BY a.id ORDER BY a.account_code`;
    
    const result = (startDate && endDate && type === 'income')
      ? await db.prepare(query).bind(startDate, endDate).all()
      : await db.prepare(query).all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب التقرير المالي' }, 500);
  }
});

api.get('/reports/sales', checkPermission('reports', 'read'), async (c) => {
  try {
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const db = c.env.DB;
    
    const query = `
      SELECT 
        DATE(invoice_date) as date,
        COUNT(*) as invoice_count,
        SUM(total_amount) as total_sales,
        SUM(paid_amount) as total_paid
      FROM invoices
      WHERE invoice_type = 'sales' AND status != 'cancelled'
      ${startDate && endDate ? 'AND invoice_date BETWEEN ? AND ?' : ''}
      GROUP BY DATE(invoice_date)
      ORDER BY date DESC
    `;
    
    const result = (startDate && endDate)
      ? await db.prepare(query).bind(startDate, endDate).all()
      : await db.prepare(query).all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب تقرير المبيعات' }, 500);
  }
});

export default api;
