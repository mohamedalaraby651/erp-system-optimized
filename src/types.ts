// ============================================
// Type Definitions for ERP System
// ============================================

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  user?: User;
  permissions?: Permission[];
};

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  full_name_ar?: string;
  phone?: string;
  role_id: number;
  role_name?: string;
  is_active: boolean;
  last_login?: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  role_id: number;
  module: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_export: boolean;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  manager_id?: number;
  parent_department_id?: number;
  budget: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id?: number;
  employee_code: string;
  full_name: string;
  full_name_ar?: string;
  email?: string;
  phone: string;
  national_id?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  address?: string;
  department_id?: number;
  position: string;
  position_ar?: string;
  hire_date: string;
  contract_type?: 'full-time' | 'part-time' | 'contract' | 'temporary';
  salary: number;
  bank_account?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  is_active: boolean;
  termination_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  client_code: string;
  name: string;
  name_ar?: string;
  company_name?: string;
  company_name_ar?: string;
  tax_number?: string;
  email?: string;
  phone: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  client_type: 'individual' | 'company';
  credit_limit: number;
  payment_terms: number;
  discount_percentage: number;
  account_manager_id?: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  supplier_code: string;
  name: string;
  name_ar?: string;
  company_name: string;
  company_name_ar?: string;
  tax_number?: string;
  email?: string;
  phone: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  payment_terms: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  account_code: string;
  account_name: string;
  account_name_ar: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_account_id?: number;
  level: number;
  is_active: boolean;
  opening_balance: number;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_type: 'sales' | 'purchase';
  invoice_date: string;
  due_date: string;
  client_id?: number;
  supplier_id?: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance: number;
  payment_status: 'unpaid' | 'partial' | 'paid';
  status: 'draft' | 'sent' | 'approved' | 'cancelled';
  currency: string;
  notes?: string;
  terms?: string;
  created_by: number;
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_number: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_rate: number;
  line_total: number;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  entry_number: string;
  entry_date: string;
  description: string;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  total_debit: number;
  total_credit: number;
  status: 'pending' | 'posted' | 'reversed';
  posted_by?: number;
  posted_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryLine {
  id: number;
  journal_entry_id: number;
  account_id: number;
  description?: string;
  debit: number;
  credit: number;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalClients: number;
  totalSuppliers: number;
  totalEmployees: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalInvoicesAmount: number;
  paidInvoicesAmount: number;
}
