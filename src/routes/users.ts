// ============================================
// Users Routes
// ============================================

import { Hono } from 'hono';
import { authMiddleware, checkPermission } from '../middleware/auth';
import { hashPassword } from '../utils/password';
import { generateCode, getCurrentDateTime, buildPaginationClause } from '../utils/db';
import type { Bindings, Variables, User } from '../types';

const users = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Apply auth middleware to all routes
users.use('/*', authMiddleware);

// Get all users with pagination
users.get('/', checkPermission('users', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    let query = `
      SELECT u.*, r.name as role_name, r.name_ar as role_name_ar
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `;
    
    const params: any[] = [];
    
    if (search) {
      query += ` WHERE u.username LIKE ? OR u.email LIKE ? OR u.full_name LIKE ?`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const result = await db.prepare(query).bind(...params).all<User>();
    
    const countQuery = search 
      ? `SELECT COUNT(*) as total FROM users WHERE username LIKE ? OR email LIKE ? OR full_name LIKE ?`
      : `SELECT COUNT(*) as total FROM users`;
    
    const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const countResult = await db.prepare(countQuery).bind(...countParams).first<{ total: number }>();
    
    const total = countResult?.total || 0;
    
    return c.json({
      success: true,
      data: result.results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب المستخدمين' }, 500);
  }
});

// Get single user
users.get('/:id', checkPermission('users', 'read'), async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const user = await db
      .prepare(`
        SELECT u.*, r.name as role_name, r.name_ar as role_name_ar
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `)
      .bind(id)
      .first<User>();
    
    if (!user) {
      return c.json({ success: false, error: 'المستخدم غير موجود' }, 404);
    }
    
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب بيانات المستخدم' }, 500);
  }
});

// Create new user
users.post('/', checkPermission('users', 'create'), async (c) => {
  try {
    const data = await c.req.json<Partial<User> & { password: string }>();
    const db = c.env.DB;
    
    // Validation
    if (!data.username || !data.email || !data.password || !data.full_name || !data.role_id) {
      return c.json({ 
        success: false, 
        error: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' 
      }, 400);
    }
    
    // Check if username or email already exists
    const existing = await db
      .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .bind(data.username, data.email)
      .first();
    
    if (existing) {
      return c.json({ 
        success: false, 
        error: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل' 
      }, 400);
    }
    
    // Hash password
    const password_hash = await hashPassword(data.password);
    
    // Insert user
    const result = await db
      .prepare(`
        INSERT INTO users (
          username, email, password_hash, full_name, full_name_ar, 
          phone, role_id, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        data.username,
        data.email,
        password_hash,
        data.full_name,
        data.full_name_ar || null,
        data.phone || null,
        data.role_id,
        data.is_active !== undefined ? data.is_active : 1,
        getCurrentDateTime(),
        getCurrentDateTime()
      )
      .run();
    
    return c.json({ 
      success: true, 
      message: 'تم إنشاء المستخدم بنجاح',
      data: { id: result.meta.last_row_id }
    }, 201);
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء إنشاء المستخدم' }, 500);
  }
});

// Update user
users.put('/:id', checkPermission('users', 'update'), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json<Partial<User>>();
    const db = c.env.DB;
    
    // Check if user exists
    const existing = await db.prepare('SELECT id FROM users WHERE id = ?').bind(id).first();
    if (!existing) {
      return c.json({ success: false, error: 'المستخدم غير موجود' }, 404);
    }
    
    // Update user
    await db
      .prepare(`
        UPDATE users SET
          full_name = COALESCE(?, full_name),
          full_name_ar = COALESCE(?, full_name_ar),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          role_id = COALESCE(?, role_id),
          is_active = COALESCE(?, is_active),
          updated_at = ?
        WHERE id = ?
      `)
      .bind(
        data.full_name || null,
        data.full_name_ar || null,
        data.email || null,
        data.phone || null,
        data.role_id || null,
        data.is_active !== undefined ? data.is_active : null,
        getCurrentDateTime(),
        id
      )
      .run();
    
    return c.json({ success: true, message: 'تم تحديث بيانات المستخدم بنجاح' });
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء تحديث بيانات المستخدم' }, 500);
  }
});

// Delete user
users.delete('/:id', checkPermission('users', 'delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user');
    const db = c.env.DB;
    
    // Prevent deleting own account
    if (currentUser?.id.toString() === id) {
      return c.json({ success: false, error: 'لا يمكنك حذف حسابك الخاص' }, 400);
    }
    
    // Soft delete (set is_active to false)
    const result = await db
      .prepare('UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?')
      .bind(getCurrentDateTime(), id)
      .run();
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: 'المستخدم غير موجود' }, 404);
    }
    
    return c.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء حذف المستخدم' }, 500);
  }
});

// Get all roles
users.get('/roles/list', checkPermission('users', 'read'), async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare('SELECT * FROM roles ORDER BY id').all();
    
    return c.json({ success: true, data: result.results });
  } catch (error) {
    console.error('Get roles error:', error);
    return c.json({ success: false, error: 'حدث خطأ أثناء جلب الأدوار' }, 500);
  }
});

export default users;
