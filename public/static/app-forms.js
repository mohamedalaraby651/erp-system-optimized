// ============================================
// ERP System - Forms and Profile Pages
// CRUD Forms and Profile Viewing
// ============================================

// Table Headers for Different Modules
function getTableHeaders(module) {
    const headers = {
        departments: `
            <th class="px-4 py-3 text-right">اسم القسم</th>
            <th>اسم القسم (EN)</th>
            <th>المدير</th>
            <th>الميزانية</th>
            <th>الإجراءات</th>
        `,
        employees: `
            <th class="px-4 py-3 text-right">كود الموظف</th>
            <th>الاسم</th>
            <th>القسم</th>
            <th>الوظيفة</th>
            <th>المرتب</th>
            <th>الإجراءات</th>
        `,
        clients: `
            <th class="px-4 py-3 text-right">كود العميل</th>
            <th>الاسم</th>
            <th>الشركة</th>
            <th>الهاتف</th>
            <th>البريد</th>
            <th>النوع</th>
            <th>الإجراءات</th>
        `,
        suppliers: `
            <th class="px-4 py-3 text-right">كود المورد</th>
            <th>الاسم</th>
            <th>الشركة</th>
            <th>الهاتف</th>
            <th>البريد</th>
            <th>الإجراءات</th>
        `,
        invoices: `
            <th class="px-4 py-3 text-right">رقم الفاتورة</th>
            <th>النوع</th>
            <th>العميل/المورد</th>
            <th>التاريخ</th>
            <th>المبلغ</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
        `,
        inventory: `
            <th class="px-4 py-3 text-right">كود الصنف</th>
            <th>اسم الصنف</th>
            <th>الكمية</th>
            <th>سعر الشراء</th>
            <th>سعر البيع</th>
            <th>الإجراءات</th>
        `,
        attendance: `
            <th class="px-4 py-3 text-right">الموظف</th>
            <th>التاريخ</th>
            <th>تسجيل الدخول</th>
            <th>تسجيل الخروج</th>
            <th>ساعات العمل</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
        `,
        payroll: `
            <th class="px-4 py-3 text-right">الموظف</th>
            <th>الشهر</th>
            <th>الراتب الأساسي</th>
            <th>البدلات</th>
            <th>الخصومات</th>
            <th>صافي الراتب</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
        `,
        crm: `
            <th class="px-4 py-3 text-right">العميل</th>
            <th>نوع التفاعل</th>
            <th>الموضوع</th>
            <th>التاريخ</th>
            <th>النتيجة</th>
            <th>الإجراءات</th>
        `,
        opportunities: `
            <th class="px-4 py-3 text-right">اسم الفرصة</th>
            <th>العميل</th>
            <th>القيمة المتوقعة</th>
            <th>المرحلة</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
        `
    };
    return headers[module] || '<th>البيانات</th><th>الإجراءات</th>';
}

// Table Rows Rendering
function renderTableRows(module) {
    if (!state.currentData || state.currentData.length === 0) {
        return `<tr><td colspan="10" class="text-center py-8 text-gray-500 dark:text-gray-400">${t('no_data')}</td></tr>`;
    }
    
    return state.currentData.map(item => {
        let row = '<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">';
        
        if (module === 'departments') {
            row += `
                <td class="px-4 py-4 font-semibold">${item.name_ar || item.name}</td>
                <td>${item.name}</td>
                <td>${item.manager_name || '-'}</td>
                <td>${(item.budget || 0).toLocaleString('ar-EG')} ج.م</td>
            `;
        } else if (module === 'employees') {
            row += `
                <td class="px-4 py-4">
                    <span class="font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">${item.employee_code}</span>
                </td>
                <td>
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold ml-3">
                            ${(item.full_name || item.full_name_ar || 'A').substring(0, 1)}
                        </div>
                        <div>
                            <p class="font-semibold">${item.full_name_ar || item.full_name}</p>
                            <p class="text-xs text-gray-500">${item.email || ''}</p>
                        </div>
                    </div>
                </td>
                <td>${item.department_name || '-'}</td>
                <td>${item.position_ar || item.position || '-'}</td>
                <td class="font-semibold text-green-600">${(item.salary || 0).toLocaleString('ar-EG')} ج.م</td>
            `;
        } else if (module === 'clients') {
            row += `
                <td class="px-4 py-4">
                    <span class="font-mono bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">${item.client_code}</span>
                </td>
                <td>
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold ml-3">
                            ${(item.name || item.name_ar || 'C').substring(0, 1)}
                        </div>
                        <p class="font-semibold">${item.name_ar || item.name}</p>
                    </div>
                </td>
                <td>${item.company_name || '-'}</td>
                <td><i class="fas fa-phone ml-1 text-blue-600"></i>${item.phone}</td>
                <td>${item.email || '-'}</td>
                <td><span class="badge ${item.client_type === 'company' ? 'badge-blue' : 'badge-green'}">
                    ${item.client_type === 'company' ? 'شركة' : 'فرد'}
                </span></td>
            `;
        } else if (module === 'suppliers') {
            row += `
                <td class="px-4 py-4">
                    <span class="font-mono bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">${item.supplier_code}</span>
                </td>
                <td>
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold ml-3">
                            ${(item.name || item.name_ar || 'S').substring(0, 1)}
                        </div>
                        <p class="font-semibold">${item.name_ar || item.name}</p>
                    </div>
                </td>
                <td>${item.company_name || '-'}</td>
                <td><i class="fas fa-phone ml-1 text-blue-600"></i>${item.phone}</td>
                <td>${item.email || '-'}</td>
            `;
        } else if (module === 'invoices') {
            row += `
                <td class="px-4 py-4">
                    <span class="font-mono bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">${item.invoice_number}</span>
                </td>
                <td><span class="badge ${item.invoice_type === 'sales' ? 'badge-green' : 'badge-purple'}">
                    ${item.invoice_type === 'sales' ? 'مبيعات' : 'مشتريات'}
                </span></td>
                <td>${item.party_name || '-'}</td>
                <td>${new Date(item.invoice_date).toLocaleDateString('ar-EG')}</td>
                <td class="font-semibold text-blue-600">${(item.total_amount || 0).toLocaleString('ar-EG')} ج.م</td>
                <td><span class="badge ${
                    item.payment_status === 'paid' ? 'badge-green' : 
                    item.payment_status === 'partial' ? 'badge-yellow' : 'badge-red'
                }">
                    ${item.payment_status === 'paid' ? 'مدفوع' : item.payment_status === 'partial' ? 'جزئي' : 'معلق'}
                </span></td>
            `;
        } else if (module === 'inventory') {
            row += `
                <td class="px-4 py-4">
                    <span class="font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">${item.item_code}</span>
                </td>
                <td class="font-semibold">${item.item_name_ar || item.item_name}</td>
                <td><span class="badge ${item.quantity > 10 ? 'badge-green' : 'badge-red'}">${item.quantity} وحدة</span></td>
                <td>${(item.unit_cost || 0).toLocaleString('ar-EG')} ج.م</td>
                <td class="font-semibold text-green-600">${(item.selling_price || 0).toLocaleString('ar-EG')} ج.م</td>
            `;
        } else if (module === 'attendance') {
            row += `
                <td class="px-4 py-4">${item.employee_name || '-'}</td>
                <td>${new Date(item.attendance_date).toLocaleDateString('ar-EG')}</td>
                <td>${item.check_in || '-'}</td>
                <td>${item.check_out || '-'}</td>
                <td>${item.total_hours || 0} ساعة</td>
                <td><span class="badge ${
                    item.status === 'present' ? 'badge-green' : 
                    item.status === 'late' ? 'badge-yellow' : 'badge-red'
                }">
                    ${item.status === 'present' ? 'حاضر' : item.status === 'late' ? 'متأخر' : 'غائب'}
                </span></td>
            `;
        } else if (module === 'payroll') {
            row += `
                <td class="px-4 py-4">${item.employee_name || '-'}</td>
                <td>${item.payroll_month || '-'}</td>
                <td>${(item.basic_salary || 0).toLocaleString('ar-EG')} ج.م</td>
                <td class="text-green-600">${(item.total_allowances || 0).toLocaleString('ar-EG')} ج.م</td>
                <td class="text-red-600">${(item.total_deductions || 0).toLocaleString('ar-EG')} ج.م</td>
                <td class="font-bold text-blue-600">${(item.net_salary || 0).toLocaleString('ar-EG')} ج.م</td>
                <td><span class="badge ${item.status === 'paid' ? 'badge-green' : 'badge-yellow'}">
                    ${item.status === 'paid' ? 'مدفوع' : 'معلق'}
                </span></td>
            `;
        } else if (module === 'crm') {
            row += `
                <td class="px-4 py-4">${item.client_name || '-'}</td>
                <td>${item.interaction_type_ar || item.interaction_type || '-'}</td>
                <td class="font-semibold">${item.subject || '-'}</td>
                <td>${new Date(item.interaction_date).toLocaleDateString('ar-EG')}</td>
                <td>${item.outcome || '-'}</td>
            `;
        } else if (module === 'opportunities') {
            row += `
                <td class="px-4 py-4 font-semibold">${item.opportunity_name || '-'}</td>
                <td>${item.client_name || '-'}</td>
                <td class="font-bold text-green-600">${(item.estimated_value || 0).toLocaleString('ar-EG')} ج.م</td>
                <td><span class="badge badge-blue">${item.stage_ar || item.stage || '-'}</span></td>
                <td><span class="badge ${
                    item.status === 'won' ? 'badge-green' : 
                    item.status === 'lost' ? 'badge-red' : 'badge-yellow'
                }">
                    ${item.status === 'won' ? 'فوز' : item.status === 'lost' ? 'خسارة' : 'نشط'}
                </span></td>
            `;
        }
        
        row += `
            <td class="px-4 py-4">
                <div class="flex space-x-2 space-x-reverse">
                    <button onclick="viewProfile('${module}', ${item.id})" 
                        class="icon-button-small text-green-600 hover:text-green-800" 
                        title="عرض البروفايل">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editItem('${module}', ${item.id})" 
                        class="icon-button-small text-blue-600 hover:text-blue-800"
                        title="${t('edit')}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${module === 'invoices' ? `
                    <button onclick="printInvoice(${item.id})" 
                        class="icon-button-small text-purple-600 hover:text-purple-800"
                        title="${t('print')}">
                        <i class="fas fa-print"></i>
                    </button>
                    ` : ''}
                    <button onclick="deleteData('${module}', ${item.id})" 
                        class="icon-button-small text-red-600 hover:text-red-800"
                        title="${t('delete')}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
        
        return row;
    }).join('');
}

// Filter Table
function filterTable(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

// Show Add Form
function showAddForm(module) {
    const formContent = generateForm(module);
    openModal(`إضافة ${getPageTitle(module)} جديد`, formContent);
}

// Edit Item
async function editItem(module, id) {
    try {
        showLoading();
        const response = await api.get(`/${module}/${id}`);
        if (response.data.success) {
            const formContent = generateForm(module, response.data.data);
            openModal(`تعديل ${getPageTitle(module)}`, formContent);
        }
    } catch (error) {
        showNotification('خطأ في تحميل البيانات', 'error');
    } finally {
        hideLoading();
    }
}

// Generate Form based on Module
function generateForm(module, data = null) {
    const formId = 'crudForm';
    let fields = '';
    
    if (module === 'employees') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="input-group">
                    <label>الاسم الكامل (عربي)</label>
                    <input type="text" name="full_name_ar" value="${data?.full_name_ar || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>الاسم الكامل (إنجليزي)</label>
                    <input type="text" name="full_name" value="${data?.full_name || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" name="email" value="${data?.email || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>رقم الهاتف</label>
                    <input type="tel" name="phone" value="${data?.phone || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>القسم</label>
                    <select name="department_id" class="modern-input" required>
                        <option value="">اختر القسم</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>الوظيفة</label>
                    <input type="text" name="position" value="${data?.position || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>المرتب</label>
                    <input type="number" name="salary" value="${data?.salary || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>تاريخ التعيين</label>
                    <input type="date" name="hire_date" value="${data?.hire_date || ''}" class="modern-input" required>
                </div>
                <div class="input-group md:col-span-2">
                    <label>العنوان</label>
                    <textarea name="address" class="modern-input" rows="2">${data?.address || ''}</textarea>
                </div>
            </div>
        `;
    } else if (module === 'clients') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="input-group">
                    <label>اسم العميل (عربي)</label>
                    <input type="text" name="name_ar" value="${data?.name_ar || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>اسم العميل (إنجليزي)</label>
                    <input type="text" name="name" value="${data?.name || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>اسم الشركة</label>
                    <input type="text" name="company_name" value="${data?.company_name || ''}" class="modern-input">
                </div>
                <div class="input-group">
                    <label>نوع العميل</label>
                    <select name="client_type" class="modern-input" required>
                        <option value="individual" ${data?.client_type === 'individual' ? 'selected' : ''}>فرد</option>
                        <option value="company" ${data?.client_type === 'company' ? 'selected' : ''}>شركة</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" name="email" value="${data?.email || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>رقم الهاتف</label>
                    <input type="tel" name="phone" value="${data?.phone || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>حد الائتمان</label>
                    <input type="number" name="credit_limit" value="${data?.credit_limit || '0'}" class="modern-input">
                </div>
                <div class="input-group">
                    <label>شروط الدفع (أيام)</label>
                    <input type="number" name="payment_terms_days" value="${data?.payment_terms_days || '30'}" class="modern-input">
                </div>
                <div class="input-group md:col-span-2">
                    <label>العنوان</label>
                    <textarea name="address" class="modern-input" rows="2">${data?.address || ''}</textarea>
                </div>
            </div>
        `;
    } else if (module === 'suppliers') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="input-group">
                    <label>اسم المورد (عربي)</label>
                    <input type="text" name="name_ar" value="${data?.name_ar || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>اسم المورد (إنجليزي)</label>
                    <input type="text" name="name" value="${data?.name || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>اسم الشركة</label>
                    <input type="text" name="company_name" value="${data?.company_name || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" name="email" value="${data?.email || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>رقم الهاتف</label>
                    <input type="tel" name="phone" value="${data?.phone || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>شروط الدفع</label>
                    <input type="text" name="payment_terms" value="${data?.payment_terms || 'Net 30'}" class="modern-input">
                </div>
                <div class="input-group md:col-span-2">
                    <label>العنوان</label>
                    <textarea name="address" class="modern-input" rows="2">${data?.address || ''}</textarea>
                </div>
            </div>
        `;
    } else if (module === 'departments') {
        fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="input-group">
                    <label>اسم القسم (عربي)</label>
                    <input type="text" name="name_ar" value="${data?.name_ar || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>اسم القسم (إنجليزي)</label>
                    <input type="text" name="name" value="${data?.name || ''}" class="modern-input" required>
                </div>
                <div class="input-group">
                    <label>الميزانية</label>
                    <input type="number" name="budget" value="${data?.budget || '0'}" class="modern-input">
                </div>
                <div class="input-group">
                    <label>المدير</label>
                    <select name="manager_id" class="modern-input">
                        <option value="">اختر المدير</option>
                    </select>
                </div>
                <div class="input-group md:col-span-2">
                    <label>الوصف</label>
                    <textarea name="description" class="modern-input" rows="3">${data?.description || ''}</textarea>
                </div>
            </div>
        `;
    } else {
        fields = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-tools text-4xl mb-4"></i>
                <p>النموذج قيد التطوير</p>
            </div>
        `;
    }
    
    return `
        <form id="${formId}" onsubmit="event.preventDefault(); submitForm('${module}', ${data?.id || 'null'})">
            ${fields}
            <div class="flex justify-end space-x-4 space-x-reverse mt-6">
                <button type="button" onclick="closeModal()" class="modern-button-secondary">
                    <i class="fas fa-times ml-2"></i>${t('cancel')}
                </button>
                <button type="submit" class="modern-button">
                    <i class="fas fa-save ml-2"></i>${t('save')}
                </button>
            </div>
        </form>
    `;
}

// Submit Form
function submitForm(module, id) {
    const form = document.getElementById('crudForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    saveData(module, data, id);
}

// Profile Page Rendering (with Tabs)
function renderProfilePage(module, data) {
    const content = `
        <div class="space-y-6">
            <!-- Profile Header -->
            <div class="glass-card bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl font-bold ml-6 border-4 border-white/30">
                            ${(data.full_name || data.name || data.full_name_ar || data.name_ar || 'A').substring(0, 1)}
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold mb-2">${data.full_name_ar || data.name_ar || data.full_name || data.name}</h2>
                            <p class="text-lg opacity-90">
                                ${module === 'employees' ? `${data.position || ''} - ${data.department_name || ''}` : 
                                  module === 'clients' ? `${data.client_type === 'company' ? 'شركة' : 'فرد'} - ${data.company_name || ''}` :
                                  module === 'suppliers' ? `${data.company_name || ''}` : ''}
                            </p>
                            <p class="text-sm opacity-75 mt-1">
                                <i class="fas fa-calendar ml-1"></i>
                                تاريخ التسجيل: ${new Date(data.created_at).toLocaleDateString('ar-EG')}
                            </p>
                        </div>
                    </div>
                    <button onclick="loadData('${module}')" class="modern-button-light">
                        <i class="fas fa-arrow-right ml-2"></i>رجوع
                    </button>
                </div>
            </div>
            
            <!-- Tabs -->
            <div class="glass-card">
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="flex space-x-8 space-x-reverse">
                        <button onclick="switchProfileTab('personal')" 
                            class="profile-tab active-tab py-4 px-6 font-semibold">
                            <i class="fas fa-user ml-2"></i>${t('personal_info')}
                        </button>
                        <button onclick="switchProfileTab('transactions')" 
                            class="profile-tab py-4 px-6 font-semibold">
                            <i class="fas fa-exchange-alt ml-2"></i>${t('financial_transactions')}
                        </button>
                        <button onclick="switchProfileTab('documents')" 
                            class="profile-tab py-4 px-6 font-semibold">
                            <i class="fas fa-file-alt ml-2"></i>${t('documents')}
                        </button>
                        <button onclick="switchProfileTab('activity')" 
                            class="profile-tab py-4 px-6 font-semibold">
                            <i class="fas fa-history ml-2"></i>${t('activity')}
                        </button>
                    </nav>
                </div>
                
                <div id="profileTabContent" class="p-6">
                    ${renderPersonalInfoTab(module, data)}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('pageContent').innerHTML = content;
}

// Personal Info Tab
function renderPersonalInfoTab(module, data) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-id-card text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">الكود</span>
                </div>
                <p class="text-lg font-semibold">${data.employee_code || data.client_code || data.supplier_code || '-'}</p>
            </div>
            
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-envelope text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">البريد الإلكتروني</span>
                </div>
                <p class="text-lg font-semibold">${data.email || '-'}</p>
            </div>
            
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-phone text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">الهاتف</span>
                </div>
                <p class="text-lg font-semibold">${data.phone || '-'}</p>
            </div>
            
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-map-marker-alt text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">العنوان</span>
                </div>
                <p class="text-lg font-semibold">${data.address || '-'}</p>
            </div>
            
            ${module === 'employees' ? `
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-money-bill-wave text-green-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">المرتب</span>
                </div>
                <p class="text-lg font-semibold text-green-600">${(data.salary || 0).toLocaleString('ar-EG')} ج.م</p>
            </div>
            
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-calendar text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">تاريخ التعيين</span>
                </div>
                <p class="text-lg font-semibold">${new Date(data.hire_date).toLocaleDateString('ar-EG')}</p>
            </div>
            ` : ''}
            
            ${module === 'clients' ? `
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-credit-card text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">حد الائتمان</span>
                </div>
                <p class="text-lg font-semibold">${(data.credit_limit || 0).toLocaleString('ar-EG')} ج.م</p>
            </div>
            
            <div class="info-card">
                <div class="flex items-center mb-2">
                    <i class="fas fa-clock text-blue-600 ml-2"></i>
                    <span class="text-gray-600 dark:text-gray-400">شروط الدفع</span>
                </div>
                <p class="text-lg font-semibold">${data.payment_terms_days || 30} يوم</p>
            </div>
            ` : ''}
        </div>
    `;
}

// Switch Profile Tab
function switchProfileTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.profile-tab').forEach(btn => {
        btn.classList.remove('active-tab');
    });
    event.target.closest('.profile-tab').classList.add('active-tab');
    
    // Update content
    const content = document.getElementById('profileTabContent');
    
    if (tab === 'personal') {
        content.innerHTML = renderPersonalInfoTab(state.currentModule, state.currentItem);
    } else if (tab === 'transactions') {
        content.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full modern-table">
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>النوع</th>
                            <th>الوصف</th>
                            <th>المبلغ</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5" class="text-center py-8 text-gray-500">لا توجد معاملات مالية</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (tab === 'documents') {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-file-upload text-6xl text-gray-400 mb-4"></i>
                <p class="text-gray-500 mb-4">لا توجد مستندات مرفوعة</p>
                <button class="modern-button">
                    <i class="fas fa-upload ml-2"></i>رفع مستند جديد
                </button>
            </div>
        `;
    } else if (tab === 'activity') {
        content.innerHTML = `
            <div class="space-y-4">
                <div class="activity-item">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
                            <i class="fas fa-plus text-blue-600"></i>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold">تم إنشاء السجل</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${new Date(state.currentItem.created_at).toLocaleString('ar-EG')}</p>
                        </div>
                    </div>
                </div>
                ${state.currentItem.updated_at !== state.currentItem.created_at ? `
                <div class="activity-item">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center ml-4">
                            <i class="fas fa-edit text-green-600"></i>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold">تم تحديث البيانات</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${new Date(state.currentItem.updated_at).toLocaleString('ar-EG')}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
}

// Show Notifications Panel
function showNotifications() {
    if (state.notifications.length === 0) {
        showNotification('لا توجد إشعارات جديدة', 'info');
        return;
    }
    
    const content = `
        <div class="space-y-3">
            ${state.notifications.map(notif => `
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div class="flex items-start">
                        <i class="fas fa-bell text-blue-600 mt-1 ml-3"></i>
                        <div class="flex-1">
                            <p class="font-semibold">${notif.title}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${notif.message}</p>
                            <p class="text-xs text-gray-500 mt-2">${new Date(notif.created_at).toLocaleString('ar-EG')}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    openModal('الإشعارات', content);
}

// Initialize on Document Ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    render();
});
