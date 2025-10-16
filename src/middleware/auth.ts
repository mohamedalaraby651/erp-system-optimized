// ============================================
// Authentication Middleware
// ============================================

import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';
import type { Bindings, Variables, User, Permission } from '../types';

export async function authMiddleware(
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'غير مصرح - يجب تسجيل الدخول' }, 401);
  }
  
  const token = authHeader.substring(7);
  const payload = await verifyToken(token);
  
  if (!payload) {
    return c.json({ success: false, error: 'رمز المصادقة غير صالح أو منتهي الصلاحية' }, 401);
  }
  
  // Get user from database
  const db = c.env.DB;
  const user = await db
    .prepare(`
      SELECT u.*, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ? AND u.is_active = 1
    `)
    .bind(payload.userId)
    .first<User>();
  
  if (!user) {
    return c.json({ success: false, error: 'المستخدم غير موجود أو غير نشط' }, 401);
  }
  
  // Get user permissions
  const permissions = await db
    .prepare(`
      SELECT * FROM permissions WHERE role_id = ?
    `)
    .bind(user.role_id)
    .all<Permission>();
  
  c.set('user', user);
  c.set('permissions', permissions.results || []);
  
  await next();
}

export function checkPermission(module: string, action: 'create' | 'read' | 'update' | 'delete' | 'export') {
  return async (c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) => {
    const permissions = c.get('permissions') || [];
    const user = c.get('user');
    
    // Admin has all permissions
    if (user?.role_name === 'admin') {
      await next();
      return;
    }
    
    const permission = permissions.find(p => p.module === module);
    
    if (!permission) {
      return c.json({ success: false, error: 'ليس لديك صلاحية للوصول إلى هذا القسم' }, 403);
    }
    
    const hasPermission = 
      (action === 'create' && permission.can_create) ||
      (action === 'read' && permission.can_read) ||
      (action === 'update' && permission.can_update) ||
      (action === 'delete' && permission.can_delete) ||
      (action === 'export' && permission.can_export);
    
    if (!hasPermission) {
      return c.json({ success: false, error: `ليس لديك صلاحية ${getActionArabic(action)} في هذا القسم` }, 403);
    }
    
    await next();
  };
}

function getActionArabic(action: string): string {
  const actions: Record<string, string> = {
    create: 'الإضافة',
    read: 'القراءة',
    update: 'التعديل',
    delete: 'الحذف',
    export: 'التصدير',
  };
  return actions[action] || action;
}
