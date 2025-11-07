-- ============================================
-- تحسين الأداء - فهارس إضافية محسّنة
-- Performance Optimization - Additional Indexes
-- ============================================

-- فهارس مركبة للاستعلامات الشائعة
-- Composite indexes for common queries

-- تحسين استعلامات الموظفين النشطين في قسم معين
CREATE INDEX IF NOT EXISTS idx_employees_dept_active ON employees(department_id, is_active);

-- تحسين استعلامات العملاء النشطين
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);

-- تحسين استعلامات الموردين النشطين
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(is_active);

-- تحسين استعلامات الفواتير حسب التاريخ والحالة
CREATE INDEX IF NOT EXISTS idx_invoices_date_status ON invoices(invoice_date DESC, status);
CREATE INDEX IF NOT EXISTS idx_invoices_type_status ON invoices(invoice_type, payment_status);

-- تحسين استعلامات الفواتير المستحقة (due invoices)
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date) WHERE payment_status != 'paid';

-- تحسين استعلامات المدفوعات حسب التاريخ والحالة
CREATE INDEX IF NOT EXISTS idx_payments_date_status ON payments(payment_date DESC, status);

-- تحسين استعلامات حركات المخزون حسب التاريخ
CREATE INDEX IF NOT EXISTS idx_inventory_trans_date ON inventory_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_trans_item ON inventory_transactions(item_id, transaction_date DESC);

-- تحسين استعلامات الحضور حسب الموظف والتاريخ
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date_desc ON attendance(employee_id, attendance_date DESC);

-- تحسين استعلامات الإجازات حسب الحالة والتاريخ
CREATE INDEX IF NOT EXISTS idx_leaves_status_date ON leaves(status, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_leaves_emp_status ON leaves(employee_id, status);

-- تحسين استعلامات الرواتب حسب الموظف والفترة
CREATE INDEX IF NOT EXISTS idx_payroll_emp_period ON payroll(employee_id, pay_period_start DESC);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON payroll(status, payment_date);

-- تحسين استعلامات القيود المحاسبية
CREATE INDEX IF NOT EXISTS idx_journal_posted_date ON journal_entries(posted_at DESC) WHERE status = 'posted';
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_account ON journal_entry_lines(account_id, journal_entry_id);

-- تحسين استعلامات التفاعلات مع العملاء
CREATE INDEX IF NOT EXISTS idx_interactions_client_date ON client_interactions(client_id, interaction_date DESC);

-- تحسين استعلامات الفرص البيعية
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status, stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned ON opportunities(assigned_to, status);

-- تحسين استعلامات الإشعارات غير المقروءة
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- تحسين استعلامات سجل النشاطات
CREATE INDEX IF NOT EXISTS idx_audit_user_module ON audit_logs(user_id, module, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_module_date ON audit_logs(module, created_at DESC);

-- تحسين استعلامات العقود
CREATE INDEX IF NOT EXISTS idx_contracts_status_dates ON contracts(status, start_date, end_date);

-- تحسين استعلامات المنتجات في المخزون
CREATE INDEX IF NOT EXISTS idx_inventory_active_category ON inventory_items(is_active, category);

-- فهارس للبحث النصي السريع
CREATE INDEX IF NOT EXISTS idx_users_fullname ON users(full_name);
CREATE INDEX IF NOT EXISTS idx_employees_fullname ON employees(full_name);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- ============================================
-- تحسينات إضافية
-- ============================================

-- إضافة تحليلات للجداول لتحسين خطط الاستعلام
-- SQLite ANALYZE command will be run separately
