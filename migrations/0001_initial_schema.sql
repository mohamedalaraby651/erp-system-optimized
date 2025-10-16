-- ============================================
-- نظام إدارة الشركات المتكامل (ERP)
-- Schema قاعدة البيانات
-- ============================================

-- جدول الأدوار والصلاحيات
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL, -- admin, manager, accountant, employee
  name_ar TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الصلاحيات
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL,
  module TEXT NOT NULL, -- users, departments, employees, clients, suppliers, invoices, accounting, inventory, hr
  can_create BOOLEAN DEFAULT 0,
  can_read BOOLEAN DEFAULT 0,
  can_update BOOLEAN DEFAULT 0,
  can_delete BOOLEAN DEFAULT 0,
  can_export BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE(role_id, module)
);

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  phone TEXT,
  role_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  last_login DATETIME,
  two_factor_enabled BOOLEAN DEFAULT 0,
  two_factor_secret TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- جدول الأقسام
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  manager_id INTEGER,
  parent_department_id INTEGER,
  budget DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id),
  FOREIGN KEY (parent_department_id) REFERENCES departments(id)
);

-- جدول الموظفين
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  employee_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  national_id TEXT UNIQUE,
  date_of_birth DATE,
  gender TEXT, -- male, female
  address TEXT,
  department_id INTEGER,
  position TEXT NOT NULL,
  position_ar TEXT,
  hire_date DATE NOT NULL,
  contract_type TEXT, -- full-time, part-time, contract, temporary
  salary DECIMAL(10, 2) NOT NULL,
  bank_account TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  is_active BOOLEAN DEFAULT 1,
  termination_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- جدول العملاء
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  company_name TEXT,
  company_name_ar TEXT,
  tax_number TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  mobile TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Egypt',
  website TEXT,
  client_type TEXT DEFAULT 'individual', -- individual, company
  credit_limit DECIMAL(15, 2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 30, -- days
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  account_manager_id INTEGER,
  is_active BOOLEAN DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_manager_id) REFERENCES users(id)
);

-- جدول الموردين
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  company_name TEXT NOT NULL,
  company_name_ar TEXT,
  tax_number TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  mobile TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Egypt',
  website TEXT,
  payment_terms INTEGER DEFAULT 30, -- days
  is_active BOOLEAN DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول دليل الحسابات (Chart of Accounts)
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_code TEXT UNIQUE NOT NULL,
  account_name TEXT NOT NULL,
  account_name_ar TEXT NOT NULL,
  account_type TEXT NOT NULL, -- asset, liability, equity, revenue, expense
  parent_account_id INTEGER,
  level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT 1,
  opening_balance DECIMAL(15, 2) DEFAULT 0,
  current_balance DECIMAL(15, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_account_id) REFERENCES accounts(id)
);

-- جدول القيود المحاسبية (Journal Entries)
CREATE TABLE IF NOT EXISTS journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_number TEXT UNIQUE NOT NULL,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  reference_number TEXT,
  reference_type TEXT, -- invoice, payment, receipt, etc.
  reference_id INTEGER,
  total_debit DECIMAL(15, 2) DEFAULT 0,
  total_credit DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, posted, reversed
  posted_by INTEGER,
  posted_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- جدول تفاصيل القيود المحاسبية
CREATE TABLE IF NOT EXISTS journal_entry_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  journal_entry_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  description TEXT,
  debit DECIMAL(15, 2) DEFAULT 0,
  credit DECIMAL(15, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- جدول الفواتير
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type TEXT NOT NULL, -- sales, purchase
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  client_id INTEGER,
  supplier_id INTEGER,
  subtotal DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  balance DECIMAL(15, 2) NOT NULL,
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, partial, paid
  status TEXT DEFAULT 'draft', -- draft, sent, approved, cancelled
  currency TEXT DEFAULT 'EGP',
  notes TEXT,
  terms TEXT,
  created_by INTEGER NOT NULL,
  approved_by INTEGER,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- جدول بنود الفواتير
CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  item_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  discount_rate DECIMAL(5, 2) DEFAULT 0,
  line_total DECIMAL(15, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_number TEXT UNIQUE NOT NULL,
  payment_date DATE NOT NULL,
  payment_type TEXT NOT NULL, -- receipt, payment
  payment_method TEXT NOT NULL, -- cash, bank_transfer, check, credit_card
  amount DECIMAL(15, 2) NOT NULL,
  client_id INTEGER,
  supplier_id INTEGER,
  invoice_id INTEGER,
  reference_number TEXT,
  bank_name TEXT,
  check_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'completed', -- pending, completed, cancelled
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- جدول العقود
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_number TEXT UNIQUE NOT NULL,
  contract_type TEXT NOT NULL, -- client, supplier, employee
  party_type TEXT NOT NULL, -- client, supplier, employee
  party_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  contract_value DECIMAL(15, 2),
  payment_schedule TEXT,
  terms TEXT,
  status TEXT DEFAULT 'draft', -- draft, active, expired, terminated
  document_url TEXT,
  created_by INTEGER NOT NULL,
  approved_by INTEGER,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- جدول المخزون - المنتجات/الأصناف
CREATE TABLE IF NOT EXISTS inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_code TEXT UNIQUE NOT NULL,
  item_name TEXT NOT NULL,
  item_name_ar TEXT,
  description TEXT,
  category TEXT,
  unit TEXT NOT NULL, -- piece, kg, liter, meter, etc.
  unit_ar TEXT,
  quantity DECIMAL(10, 2) DEFAULT 0,
  reorder_level DECIMAL(10, 2) DEFAULT 0,
  unit_cost DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  supplier_id INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- جدول حركات المخزون
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_number TEXT UNIQUE NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL, -- purchase, sale, adjustment, return
  item_id INTEGER NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_cost DECIMAL(10, 2),
  total_cost DECIMAL(15, 2),
  reference_type TEXT, -- invoice, order
  reference_id INTEGER,
  notes TEXT,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- جدول الحضور والانصراف
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  attendance_date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  total_hours DECIMAL(5, 2),
  status TEXT DEFAULT 'present', -- present, absent, late, half-day, leave
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  UNIQUE(employee_id, attendance_date)
);

-- جدول الإجازات
CREATE TABLE IF NOT EXISTS leaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  leave_type TEXT NOT NULL, -- annual, sick, emergency, unpaid
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  approved_by INTEGER,
  approved_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- جدول الرواتب
CREATE TABLE IF NOT EXISTS payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  basic_salary DECIMAL(10, 2) NOT NULL,
  allowances DECIMAL(10, 2) DEFAULT 0,
  bonuses DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  insurance DECIMAL(10, 2) DEFAULT 0,
  net_salary DECIMAL(10, 2) NOT NULL,
  payment_date DATE,
  payment_method TEXT,
  status TEXT DEFAULT 'pending', -- pending, paid
  notes TEXT,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- جدول تفاعلات العملاء (CRM)
CREATE TABLE IF NOT EXISTS client_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  interaction_type TEXT NOT NULL, -- call, email, meeting, visit
  interaction_date DATETIME NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  handled_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (handled_by) REFERENCES users(id)
);

-- جدول الفرص البيعية
CREATE TABLE IF NOT EXISTS opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  opportunity_name TEXT NOT NULL,
  client_id INTEGER NOT NULL,
  estimated_value DECIMAL(15, 2) NOT NULL,
  probability INTEGER DEFAULT 50, -- 0-100
  expected_close_date DATE,
  stage TEXT DEFAULT 'lead', -- lead, qualified, proposal, negotiation, won, lost
  status TEXT DEFAULT 'open', -- open, won, lost
  description TEXT,
  assigned_to INTEGER NOT NULL,
  closed_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- جدول سجل النشاطات (Audit Log)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL, -- create, read, update, delete
  module TEXT NOT NULL,
  record_id INTEGER,
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, error, success
  is_read BOOLEAN DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول الإعدادات العامة
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string', -- string, number, boolean, json
  description TEXT,
  updated_by INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ============================================
-- إنشاء الفهارس (Indexes)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_clients_code ON clients(client_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_accounts_code ON accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status ON journal_entries(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_supplier ON invoices(supplier_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory_items(item_code);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
