-- ============================================
-- بيانات تجريبية شاملة - Extended Seed Data
-- ============================================

-- إضافة المزيد من الموظفين
INSERT OR IGNORE INTO employees (employee_code, full_name, full_name_ar, email, phone, department_id, position, position_ar, hire_date, contract_type, salary, is_active, created_at, updated_at) VALUES 
  ('EMP-00001', 'Ahmed Ali', 'أحمد علي', 'ahmed.ali@company.com', '+201012345678', 2, 'Senior Accountant', 'محاسب أول', '2023-01-15', 'full-time', 8000, 1, datetime('now'), datetime('now')),
  ('EMP-00002', 'Sara Mohamed', 'سارة محمد', 'sara.mohamed@company.com', '+201098765432', 3, 'HR Manager', 'مدير الموارد البشرية', '2023-02-01', 'full-time', 10000, 1, datetime('now'), datetime('now')),
  ('EMP-00003', 'Khaled Hassan', 'خالد حسن', 'khaled.hassan@company.com', '+201123456789', 4, 'Sales Manager', 'مدير المبيعات', '2023-03-10', 'full-time', 12000, 1, datetime('now'), datetime('now')),
  ('EMP-00004', 'Fatma Ibrahim', 'فاطمة إبراهيم', 'fatma.ibrahim@company.com', '+201234567890', 4, 'Sales Executive', 'مندوب مبيعات', '2023-04-05', 'full-time', 6000, 1, datetime('now'), datetime('now')),
  ('EMP-00005', 'Omar Mahmoud', 'عمر محمود', 'omar.mahmoud@company.com', '+201345678901', 5, 'Purchasing Officer', 'موظف مشتريات', '2023-05-20', 'full-time', 7000, 1, datetime('now'), datetime('now')),
  ('EMP-00006', 'Mona Samir', 'منى سمير', 'mona.samir@company.com', '+201456789012', 2, 'Accountant', 'محاسب', '2023-06-15', 'full-time', 6500, 1, datetime('now'), datetime('now')),
  ('EMP-00007', 'Youssef Ahmed', 'يوسف أحمد', 'youssef.ahmed@company.com', '+201567890123', 6, 'IT Specialist', 'أخصائي تقنية معلومات', '2023-07-01', 'full-time', 9000, 1, datetime('now'), datetime('now')),
  ('EMP-00008', 'Heba Khaled', 'هبة خالد', 'heba.khaled@company.com', '+201678901234', 3, 'HR Officer', 'موظف موارد بشرية', '2023-08-10', 'full-time', 5500, 1, datetime('now'), datetime('now'));

-- إضافة المزيد من العملاء
INSERT OR IGNORE INTO clients (client_code, name, name_ar, company_name, company_name_ar, email, phone, address, city, client_type, credit_limit, payment_terms, is_active, created_at, updated_at) VALUES 
  ('CL-00004', 'Hassan Group', 'مجموعة حسن', 'Hassan Trading Co.', 'شركة حسن للتجارة', 'info@hassangroup.com', '+201100000001', '123 Business St, Nasr City', 'Cairo', 'company', 50000, 45, 1, datetime('now'), datetime('now')),
  ('CL-00005', 'Mohamed Youssef', 'محمد يوسف', NULL, NULL, 'myoussef@email.com', '+201100000002', '456 Residential Ave', 'Giza', 'individual', 15000, 30, 1, datetime('now'), datetime('now')),
  ('CL-00006', 'Elite Solutions', 'الحلول المتميزة', 'Elite Solutions Ltd', 'شركة الحلول المتميزة المحدودة', 'contact@elitesolutions.com', '+201100000003', '789 Tech Park', 'Cairo', 'company', 100000, 60, 1, datetime('now'), datetime('now')),
  ('CL-00007', 'Nadia Ibrahim', 'نادية إبراهيم', NULL, NULL, 'nadia.i@email.com', '+201100000004', '321 Garden City', 'Alexandria', 'individual', 10000, 30, 1, datetime('now'), datetime('now')),
  ('CL-00008', 'Future Enterprises', 'مؤسسات المستقبل', 'Future Enterprises Inc', 'شركة مؤسسات المستقبل', 'sales@futureent.com', '+201100000005', '555 Innovation Hub', 'Cairo', 'company', 75000, 45, 1, datetime('now'), datetime('now'));

-- إضافة المزيد من الموردين
INSERT OR IGNORE INTO suppliers (supplier_code, name, name_ar, company_name, company_name_ar, email, phone, address, city, payment_terms, is_active, created_at, updated_at) VALUES 
  ('SUP-00003', 'Ahmed Supplies', 'أحمد للتوريدات', 'Ahmed Office Supplies', 'شركة أحمد لتوريدات المكاتب', 'sales@ahmedsupplies.com', '+201200000001', '100 Supplier St', 'Cairo', 30, 1, datetime('now'), datetime('now')),
  ('SUP-00004', 'Tech Distributors', 'موزعو التقنية', 'Tech Distributors Egypt', 'شركة موزعو التقنية مصر', 'info@techdist.com', '+201200000002', '200 Tech Valley', 'Cairo', 45, 1, datetime('now'), datetime('now')),
  ('SUP-00005', 'Global Trading', 'التجارة العالمية', 'Global Trading Co.', 'شركة التجارة العالمية', 'contact@globaltrading.com', '+201200000003', '300 Import St', 'Alexandria', 60, 1, datetime('now'), datetime('now'));

-- إضافة أصناف مخزون
INSERT OR IGNORE INTO inventory_items (item_code, item_name, item_name_ar, description, category, unit, unit_ar, quantity, reorder_level, unit_cost, selling_price, supplier_id, is_active, created_at, updated_at) VALUES 
  ('ITM-00001', 'Laptop Dell XPS 15', 'لابتوب ديل XPS 15', 'High performance laptop', 'Electronics', 'piece', 'قطعة', 25, 5, 18000, 25000, 2, 1, datetime('now'), datetime('now')),
  ('ITM-00002', 'Office Chair Premium', 'كرسي مكتب فاخر', 'Ergonomic office chair', 'Furniture', 'piece', 'قطعة', 50, 10, 800, 1200, 1, 1, datetime('now'), datetime('now')),
  ('ITM-00003', 'Printer HP LaserJet', 'طابعة HP ليزر', 'Laser printer', 'Electronics', 'piece', 'قطعة', 15, 3, 3500, 5000, 2, 1, datetime('now'), datetime('now')),
  ('ITM-00004', 'Office Desk 160cm', 'مكتب 160 سم', 'Wooden office desk', 'Furniture', 'piece', 'قطعة', 30, 5, 1500, 2500, 1, 1, datetime('now'), datetime('now')),
  ('ITM-00005', 'Monitor Dell 27"', 'شاشة ديل 27 بوصة', '4K Monitor', 'Electronics', 'piece', 'قطعة', 40, 8, 4000, 6000, 2, 1, datetime('now'), datetime('now')),
  ('ITM-00006', 'Keyboard Wireless', 'لوحة مفاتيح لاسلكية', 'Wireless keyboard', 'Electronics', 'piece', 'قطعة', 100, 20, 150, 300, 2, 1, datetime('now'), datetime('now')),
  ('ITM-00007', 'Mouse Wireless', 'ماوس لاسلكي', 'Wireless mouse', 'Electronics', 'piece', 'قطعة', 120, 25, 100, 200, 2, 1, datetime('now'), datetime('now')),
  ('ITM-00008', 'Paper A4 (Ream)', 'ورق A4 (رزمة)', 'Premium A4 paper', 'Stationery', 'ream', 'رزمة', 200, 50, 35, 60, 1, 1, datetime('now'), datetime('now'));

-- إضافة فواتير مبيعات
INSERT OR IGNORE INTO invoices (invoice_number, invoice_type, invoice_date, due_date, client_id, subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance, payment_status, status, currency, created_by, created_at, updated_at) VALUES 
  ('INV-S-00001', 'sales', date('now', '-30 days'), date('now'), 1, 75000, 10500, 0, 85500, 85500, 0, 'paid', 'approved', 'EGP', 1, datetime('now', '-30 days'), datetime('now')),
  ('INV-S-00002', 'sales', date('now', '-25 days'), date('now', '+5 days'), 2, 12000, 1680, 500, 13180, 6590, 6590, 'partial', 'approved', 'EGP', 1, datetime('now', '-25 days'), datetime('now')),
  ('INV-S-00003', 'sales', date('now', '-20 days'), date('now', '+10 days'), 4, 150000, 21000, 5000, 166000, 0, 166000, 'unpaid', 'sent', 'EGP', 1, datetime('now', '-20 days'), datetime('now')),
  ('INV-S-00004', 'sales', date('now', '-15 days'), date('now', '+15 days'), 5, 8000, 1120, 0, 9120, 9120, 0, 'paid', 'approved', 'EGP', 1, datetime('now', '-15 days'), datetime('now')),
  ('INV-S-00005', 'sales', date('now', '-10 days'), date('now', '+20 days'), 6, 240000, 33600, 10000, 263600, 100000, 163600, 'partial', 'approved', 'EGP', 1, datetime('now', '-10 days'), datetime('now')),
  ('INV-S-00006', 'sales', date('now', '-5 days'), date('now', '+25 days'), 3, 50000, 7000, 2000, 55000, 0, 55000, 'unpaid', 'sent', 'EGP', 1, datetime('now', '-5 days'), datetime('now')),
  ('INV-S-00007', 'sales', date('now'), date('now', '+30 days'), 7, 30000, 4200, 0, 34200, 0, 34200, 'unpaid', 'draft', 'EGP', 1, datetime('now'), datetime('now'));

-- إضافة بنود الفواتير
INSERT OR IGNORE INTO invoice_items (invoice_id, item_number, description, quantity, unit_price, tax_rate, discount_rate, line_total, created_at) VALUES 
  (1, 1, 'Laptop Dell XPS 15', 3, 25000, 14, 0, 75000, datetime('now', '-30 days')),
  (2, 1, 'Office Chair Premium', 10, 1200, 14, 0, 12000, datetime('now', '-25 days')),
  (3, 1, 'Laptop Dell XPS 15', 6, 25000, 14, 0, 150000, datetime('now', '-20 days')),
  (4, 1, 'Monitor Dell 27"', 2, 6000, 14, 0, 12000, datetime('now', '-15 days')),
  (5, 1, 'Laptop Dell XPS 15', 10, 25000, 14, 0, 250000, datetime('now', '-10 days')),
  (6, 1, 'Office Desk 160cm', 20, 2500, 14, 0, 50000, datetime('now', '-5 days')),
  (7, 1, 'Printer HP LaserJet', 6, 5000, 14, 0, 30000, datetime('now'));

-- إضافة فواتير مشتريات
INSERT OR IGNORE INTO invoices (invoice_number, invoice_type, invoice_date, due_date, supplier_id, subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance, payment_status, status, currency, created_by, created_at, updated_at) VALUES 
  ('INV-P-00001', 'purchase', date('now', '-28 days'), date('now', '+2 days'), 1, 40000, 5600, 0, 45600, 45600, 0, 'paid', 'approved', 'EGP', 1, datetime('now', '-28 days'), datetime('now')),
  ('INV-P-00002', 'purchase', date('now', '-22 days'), date('now', '+8 days'), 2, 108000, 15120, 0, 123120, 0, 123120, 'unpaid', 'approved', 'EGP', 1, datetime('now', '-22 days'), datetime('now')),
  ('INV-P-00003', 'purchase', date('now', '-18 days'), date('now', '+12 days'), 1, 15000, 2100, 0, 17100, 17100, 0, 'paid', 'approved', 'EGP', 1, datetime('now', '-18 days'), datetime('now'));

-- إضافة سجلات حضور
INSERT OR IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, total_hours, status, created_at, updated_at) VALUES 
  (1, date('now'), '08:00', '17:00', 9, 'present', datetime('now'), datetime('now')),
  (2, date('now'), '08:30', '17:30', 9, 'present', datetime('now'), datetime('now')),
  (3, date('now'), '09:00', '18:00', 9, 'present', datetime('now'), datetime('now')),
  (4, date('now'), '08:15', '17:15', 9, 'present', datetime('now'), datetime('now')),
  (5, date('now'), '08:45', '17:45', 9, 'present', datetime('now'), datetime('now')),
  (6, date('now'), '08:00', '17:00', 9, 'present', datetime('now'), datetime('now')),
  (7, date('now'), '08:30', '17:30', 9, 'present', datetime('now'), datetime('now')),
  (8, date('now'), '09:30', '18:30', 9, 'late', datetime('now'), datetime('now'));

-- إضافة سجلات رواتب
INSERT OR IGNORE INTO payroll (employee_id, pay_period_start, pay_period_end, basic_salary, allowances, bonuses, deductions, tax, insurance, net_salary, payment_date, payment_method, status, created_by, created_at, updated_at) VALUES 
  (1, date('now', '-60 days'), date('now', '-30 days'), 8000, 1000, 500, 200, 800, 500, 8000, date('now', '-28 days'), 'bank_transfer', 'paid', 1, datetime('now', '-28 days'), datetime('now')),
  (2, date('now', '-60 days'), date('now', '-30 days'), 10000, 1500, 1000, 200, 1100, 600, 10600, date('now', '-28 days'), 'bank_transfer', 'paid', 1, datetime('now', '-28 days'), datetime('now')),
  (3, date('now', '-60 days'), date('now', '-30 days'), 12000, 2000, 1500, 200, 1300, 700, 13300, date('now', '-28 days'), 'bank_transfer', 'paid', 1, datetime('now', '-28 days'), datetime('now'));

-- إضافة تفاعلات عملاء (CRM)
INSERT OR IGNORE INTO client_interactions (client_id, interaction_type, interaction_date, subject, description, outcome, next_action, next_action_date, handled_by, created_at, updated_at) VALUES 
  (1, 'call', datetime('now', '-10 days'), 'متابعة طلب جديد', 'تم الاتصال بالعميل لمتابعة احتياجاته', 'مهتم بشراء أجهزة كمبيوتر جديدة', 'إرسال عرض سعر', date('now', '+5 days'), 1, datetime('now', '-10 days'), datetime('now')),
  (2, 'meeting', datetime('now', '-8 days'), 'اجتماع عرض المنتجات', 'عرض المنتجات الجديدة على العميل', 'طلب عينات للاختبار', 'متابعة رأي العميل', date('now', '+3 days'), 1, datetime('now', '-8 days'), datetime('now')),
  (4, 'email', datetime('now', '-5 days'), 'استفسار عن الأسعار', 'رد على استفسار العميل عن أسعار الأثاث المكتبي', 'تم إرسال عرض سعر تفصيلي', 'انتظار رد العميل', date('now', '+7 days'), 1, datetime('now', '-5 days'), datetime('now')),
  (6, 'call', datetime('now', '-3 days'), 'متابعة الفاتورة المعلقة', 'تذكير بالفاتورة المستحقة', 'وعد بالسداد خلال أسبوع', 'متابعة السداد', date('now', '+4 days'), 1, datetime('now', '-3 days'), datetime('now'));

-- إضافة فرص بيعية
INSERT OR IGNORE INTO opportunities (opportunity_name, client_id, estimated_value, probability, expected_close_date, stage, description, assigned_to, status, created_at, updated_at) VALUES 
  ('صفقة أجهزة كمبيوتر - شركة حسن', 4, 500000, 75, date('now', '+15 days'), 'negotiation', 'فرصة لتوريد 20 جهاز كمبيوتر محمول متطور', 1, 'open', datetime('now', '-7 days'), datetime('now')),
  ('تجهيز مكتب - النخبة للحلول', 6, 350000, 60, date('now', '+20 days'), 'proposal', 'تجهيز مكتب جديد بالكامل (أثاث ومعدات)', 1, 'open', datetime('now', '-5 days'), datetime('now')),
  ('عقد صيانة سنوي - مؤسسات المستقبل', 8, 120000, 85, date('now', '+10 days'), 'negotiation', 'عقد صيانة سنوي لجميع الأجهزة', 1, 'open', datetime('now', '-3 days'), datetime('now')),
  ('مبيعات منتجات مكتبية - شركة التقنية', 3, 80000, 40, date('now', '+30 days'), 'qualified', 'توريد منتجات مكتبية شهرية', 1, 'open', datetime('now', '-2 days'), datetime('now'));

-- إضافة إشعارات
INSERT OR IGNORE INTO notifications (user_id, title, message, type, is_read, link, created_at) VALUES 
  (1, 'فاتورة جديدة', 'تم إنشاء فاتورة مبيعات جديدة رقم INV-S-00007', 'info', 0, '/invoices', datetime('now')),
  (1, 'فاتورة متأخرة', 'الفاتورة INV-S-00003 متأخرة عن موعد السداد', 'warning', 0, '/invoices', datetime('now', '-1 days')),
  (1, 'عميل جديد', 'تم إضافة عميل جديد: مؤسسات المستقبل', 'success', 1, '/clients', datetime('now', '-2 days')),
  (1, 'فرصة بيعية جديدة', 'فرصة بيعية بقيمة 120,000 ج.م', 'info', 0, '/crm/opportunities', datetime('now', '-3 days'));
