// ============================================
// Authentication Routes
// ============================================

import { Hono } from 'hono';
import { comparePassword, hashPassword, validatePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';
import { getCurrentDateTime } from '../utils/db';
import type { Bindings, Variables, LoginRequest, LoginResponse, User } from '../types';

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// تسجيل الدخول
auth.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json<LoginRequest>();
    
    if (!username || !password) {
      return c.json<LoginResponse>({ 
        success: false, 
        error: 'يجب إدخال اسم المستخدم وكلمة المرور' 
      }, 400);
    }
    
    const db = c.env.DB;
    
    // البحث عن المستخدم
    const user = await db
      .prepare(`
        SELECT u.*, r.name as role_name, r.name_ar as role_name_ar
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE (u.username = ? OR u.email = ?) AND u.is_active = 1
      `)
      .bind(username, username)
      .first<User & { password_hash: string; role_name: string; role_name_ar: string }>();
    
    if (!user) {
      return c.json<LoginResponse>({ 
        success: false, 
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة' 
      }, 401);
    }
    
    // التحقق من كلمة المرور
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return c.json<LoginResponse>({ 
        success: false, 
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة' 
      }, 401);
    }
    
    // تحديث آخر تسجيل دخول
    await db
      .prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .bind(getCurrentDateTime(), user.id)
      .run();
    
    // إنشاء JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      roleId: user.role_id,
    });
    
    // إزالة كلمة المرور من الاستجابة
    const { password_hash, ...userWithoutPassword } = user;
    
    return c.json<LoginResponse>({
      success: true,
      token,
      user: userWithoutPassword,
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return c.json<LoginResponse>({ 
      success: false, 
      error: 'حدث خطأ أثناء تسجيل الدخول' 
    }, 500);
  }
});

// الحصول على بيانات المستخدم الحالي
auth.get('/me', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب بيانات المستخدم' }, 500);
  }
});

// تغيير كلمة المرور
auth.post('/change-password', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { current_password, new_password } = await c.req.json<{
      current_password: string;
      new_password: string;
    }>();
    
    if (!current_password || !new_password) {
      return c.json({ 
        success: false, 
        error: 'يجب إدخال كلمة المرور الحالية والجديدة' 
      }, 400);
    }
    
    // التحقق من صحة كلمة المرور الجديدة
    const validation = validatePassword(new_password);
    if (!validation.valid) {
      return c.json({ 
        success: false, 
        error: 'كلمة المرور غير صالحة',
        errors: validation.errors 
      }, 400);
    }
    
    const db = c.env.DB;
    
    // التحقق من كلمة المرور الحالية
    const userWithPassword = await db
      .prepare('SELECT password_hash FROM users WHERE id = ?')
      .bind(user!.id)
      .first<{ password_hash: string }>();
    
    if (!userWithPassword) {
      return c.json({ success: false, error: 'المستخدم غير موجود' }, 404);
    }
    
    const isValidPassword = await comparePassword(current_password, userWithPassword.password_hash);
    
    if (!isValidPassword) {
      return c.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }, 401);
    }
    
    // تحديث كلمة المرور
    const hashedPassword = await hashPassword(new_password);
    await db
      .prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
      .bind(hashedPassword, getCurrentDateTime(), user!.id)
      .run();
    
    return c.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء تغيير كلمة المرور' }, 500);
  }
});

export default auth;
