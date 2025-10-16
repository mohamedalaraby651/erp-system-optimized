-- ============================================
-- البيانات الأولية لنظام إدارة الشركات
-- ============================================

-- إدراج الأدوار الافتراضية
INSERT OR IGNORE INTO roles (id, name, name_ar, description) VALUES 
  (1, 'admin', 'مدير النظام', 'Full system access with all permissions'),
  (2, 'manager', 'مدير', 'Department manager with operational permissions'),
  (3, 'accountant', 'محاسب', 'Financial and accounting operations'),
  (4, 'hr_manager', 'مدير الموارد البشرية', 'Human resources management'),
  (5, 'employee', 'موظف', 'Basic employee access');

-- إدراج الصلاحيات للمدير (admin) - جميع الصلاحيات
INSERT OR IGNORE INTO permissions (role_id, module, can_create, can_read, can_update, can_delete, can_export) VALUES 
  (1, 'users', 1, 1, 1, 1, 1),
  (1, 'departments', 1, 1, 1, 1, 1),
  (1, 'employees', 1, 1, 1, 1, 1),
  (1, 'clients', 1, 1, 1, 1, 1),
  (1, 'suppliers', 1, 1, 1, 1, 1),
  (1, 'invoices', 1, 1, 1, 1, 1),
  (1, 'accounting', 1, 1, 1, 1, 1),
  (1, 'inventory', 1, 1, 1, 1, 1),
  (1, 'hr', 1, 1, 1, 1, 1),
  (1, 'contracts', 1, 1, 1, 1, 1),
  (1, 'reports', 1, 1, 1, 1, 1),
  (1, 'settings', 1, 1, 1, 1, 1);

-- إدراج الصلاحيات للمحاسب (accountant)
INSERT OR IGNORE INTO permissions (role_id, module, can_create, can_read, can_update, can_delete, can_export) VALUES 
  (3, 'clients', 1, 1, 1, 0, 1),
  (3, 'suppliers', 1, 1, 1, 0, 1),
  (3, 'invoices', 1, 1, 1, 0, 1),
  (3, 'accounting', 1, 1, 1, 0, 1),
  (3, 'reports', 0, 1, 0, 0, 1);

-- إدراج الصلاحيات لمدير الموارد البشرية
INSERT OR IGNORE INTO permissions (role_id, module, can_create, can_read, can_update, can_delete, can_export) VALUES 
  (4, 'employees', 1, 1, 1, 1, 1),
  (4, 'departments', 0, 1, 1, 0, 1),
  (4, 'hr', 1, 1, 1, 1, 1),
  (4, 'contracts', 1, 1, 1, 0, 1),
  (4, 'reports', 0, 1, 0, 0, 1);

-- إدراج الصلاحيات للموظف (employee)
INSERT OR IGNORE INTO permissions (role_id, module, can_create, can_read, can_update, can_delete, can_export) VALUES 
  (5, 'hr', 0, 1, 0, 0, 0);

-- إدراج مستخدم مدير النظام الافتراضي
-- كلمة المرور: Admin@123 (مشفرة باستخدام bcrypt)
INSERT OR IGNORE INTO users (id, username, email, password_hash, full_name, full_name_ar, phone, role_id, is_active) VALUES 
  (1, 'admin', 'admin@company.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'مدير النظام', '+201000000000', 1, 1);

-- إدراج الأقسام الافتراضية
INSERT OR IGNORE INTO departments (id, name, name_ar, description, manager_id, is_active) VALUES 
  (1, 'Management', 'الإدارة', 'Executive management department', 1, 1),
  (2, 'Accounting', 'المحاسبة', 'Financial and accounting department', 1, 1),
  (3, 'Human Resources', 'الموارد البشرية', 'HR department', 1, 1),
  (4, 'Sales', 'المبيعات', 'Sales and marketing department', 1, 1),
  (5, 'Purchasing', 'المشتريات', 'Purchasing and procurement department', 1, 1),
  (6, 'IT', 'تقنية المعلومات', 'Information technology department', 1, 1);

-- إدراج دليل الحسابات الأساسي
-- الأصول (Assets)
INSERT OR IGNORE INTO accounts (account_code, account_name, account_name_ar, account_type, level) VALUES 
  ('1000', 'Assets', 'الأصول', 'asset', 1),
  ('1100', 'Current Assets', 'الأصول المتداولة', 'asset', 2),
  ('1110', 'Cash', 'النقدية', 'asset', 3),
  ('1120', 'Bank Accounts', 'الحسابات البنكية', 'asset', 3),
  ('1130', 'Accounts Receivable', 'العملاء (المدينون)', 'asset', 3),
  ('1140', 'Inventory', 'المخزون', 'asset', 3),
  ('1200', 'Fixed Assets', 'الأصول الثابتة', 'asset', 2),
  ('1210', 'Property', 'الممتلكات', 'asset', 3),
  ('1220', 'Equipment', 'المعدات', 'asset', 3),
  ('1230', 'Vehicles', 'المركبات', 'asset', 3);

-- الخصوم (Liabilities)
INSERT OR IGNORE INTO accounts (account_code, account_name, account_name_ar, account_type, level) VALUES 
  ('2000', 'Liabilities', 'الخصوم', 'liability', 1),
  ('2100', 'Current Liabilities', 'الخصوم المتداولة', 'liability', 2),
  ('2110', 'Accounts Payable', 'الموردون (الدائنون)', 'liability', 3),
  ('2120', 'Salaries Payable', 'الرواتب المستحقة', 'liability', 3),
  ('2130', 'Taxes Payable', 'الضرائب المستحقة', 'liability', 3),
  ('2200', 'Long-term Liabilities', 'الخصوم طويلة الأجل', 'liability', 2),
  ('2210', 'Bank Loans', 'القروض البنكية', 'liability', 3);

-- حقوق الملكية (Equity)
INSERT OR IGNORE INTO accounts (account_code, account_name, account_name_ar, account_type, level) VALUES 
  ('3000', 'Equity', 'حقوق الملكية', 'equity', 1),
  ('3100', 'Capital', 'رأس المال', 'equity', 2),
  ('3200', 'Retained Earnings', 'الأرباح المحتجزة', 'equity', 2);

-- الإيرادات (Revenue)
INSERT OR IGNORE INTO accounts (account_code, account_name, account_name_ar, account_type, level) VALUES 
  ('4000', 'Revenue', 'الإيرادات', 'revenue', 1),
  ('4100', 'Sales Revenue', 'إيرادات المبيعات', 'revenue', 2),
  ('4200', 'Service Revenue', 'إيرادات الخدمات', 'revenue', 2),
  ('4300', 'Other Revenue', 'إيرادات أخرى', 'revenue', 2);

-- المصروفات (Expenses)
INSERT OR IGNORE INTO accounts (account_code, account_name, account_name_ar, account_type, level) VALUES 
  ('5000', 'Expenses', 'المصروفات', 'expense', 1),
  ('5100', 'Cost of Goods Sold', 'تكلفة البضاعة المباعة', 'expense', 2),
  ('5200', 'Operating Expenses', 'المصروفات التشغيلية', 'expense', 2),
  ('5210', 'Salaries Expense', 'مصروفات الرواتب', 'expense', 3),
  ('5220', 'Rent Expense', 'مصروفات الإيجار', 'expense', 3),
  ('5230', 'Utilities Expense', 'مصروفات المرافق', 'expense', 3),
  ('5240', 'Office Supplies', 'مصروفات اللوازم المكتبية', 'expense', 3),
  ('5250', 'Marketing Expense', 'مصروفات التسويق', 'expense', 3),
  ('5260', 'Maintenance Expense', 'مصروفات الصيانة', 'expense', 3);

-- إدراج بعض الإعدادات الافتراضية
INSERT OR IGNORE INTO settings (setting_key, setting_value, setting_type, description) VALUES 
  ('company_name', 'شركة النظام المتكامل', 'string', 'اسم الشركة'),
  ('company_name_en', 'Integrated System Company', 'string', 'Company name in English'),
  ('tax_number', '123-456-789', 'string', 'رقم التسجيل الضريبي'),
  ('currency', 'EGP', 'string', 'العملة الافتراضية'),
  ('tax_rate', '14', 'number', 'نسبة الضريبة %'),
  ('fiscal_year_start', '01-01', 'string', 'بداية السنة المالية (MM-DD)'),
  ('fiscal_year_end', '12-31', 'string', 'نهاية السنة المالية (MM-DD)'),
  ('invoice_prefix_sales', 'INV-S-', 'string', 'بادئة رقم فاتورة المبيعات'),
  ('invoice_prefix_purchase', 'INV-P-', 'string', 'بادئة رقم فاتورة المشتريات'),
  ('payment_terms_default', '30', 'number', 'شروط الدفع الافتراضية (بالأيام)'),
  ('working_hours_per_day', '8', 'number', 'ساعات العمل اليومية'),
  ('working_days_per_week', '5', 'number', 'أيام العمل الأسبوعية'),
  ('annual_leave_days', '21', 'number', 'أيام الإجازة السنوية'),
  ('backup_enabled', 'true', 'boolean', 'تفعيل النسخ الاحتياطي التلقائي'),
  ('system_language', 'ar', 'string', 'لغة النظام الافتراضية');

-- إدراج بيانات تجريبية للعملاء
INSERT OR IGNORE INTO clients (client_code, name, name_ar, email, phone, address, city, is_active) VALUES 
  ('CL-001', 'Ahmed Mohamed', 'أحمد محمد', 'ahmed@example.com', '+201012345678', '123 Main St, Cairo', 'Cairo', 1),
  ('CL-002', 'Sara Ali', 'سارة علي', 'sara@example.com', '+201098765432', '456 Elm St, Giza', 'Giza', 1),
  ('CL-003', 'Tech Solutions Co.', 'شركة الحلول التقنية', 'info@techsolutions.com', '+201555555555', '789 Business District, Cairo', 'Cairo', 1);

-- إدراج بيانات تجريبية للموردين
INSERT OR IGNORE INTO suppliers (supplier_code, name, name_ar, company_name, email, phone, address, city, is_active) VALUES 
  ('SUP-001', 'Mohamed Hassan', 'محمد حسن', 'Office Supplies Co.', 'mohamed@supplies.com', '+201011111111', '321 Supply St, Cairo', 'Cairo', 1),
  ('SUP-002', 'Fatma Khaled', 'فاطمة خالد', 'Equipment Trading', 'fatma@equipment.com', '+201022222222', '654 Trade Ave, Alexandria', 'Alexandria', 1);
