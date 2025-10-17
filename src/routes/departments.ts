// ============================================
// Departments Routes
// ============================================

import { Hono } from 'hono';
import { authMiddleware, checkPermission } from '../middleware/auth';
import { getCurrentDateTime, buildPaginationClause } from '../utils/db';
import type { Bindings, Variables, Department } from '../types';

const departments = new Hono<{ Bindings: Bindings; Variables: Variables }>();

departments.use('/*', authMiddleware);

// Get all departments
departments.get('/', checkPermission('departments', 'read'), async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const { offset } = buildPaginationClause(page, limit);
    const db = c.env.DB;
    
    const result = await db
      .prepare(`
        SELECT d.*, u.full_name as manager_name
        FROM departments d
        LEFT JOIN users u ON d.manager_id = u.id
        WHERE d.is_active = 1
        ORDER BY d.name
        LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all<Department>();
    
    const countResult = await db
      .prepare('SELECT COUNT(*) as total FROM departments WHERE is_active = 1')
      .first<{ total: number }>();
    
    return c.json({
      success: true,
      data: result.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit),
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب الأقسام' }, 500);
  }
});

// Get single department
departments.get('/:id', checkPermission('departments', 'read'), async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    const department = await db
      .prepare(`
        SELECT d.*, u.full_name as manager_name
        FROM departments d
        LEFT JOIN users u ON d.manager_id = u.id
        WHERE d.id = ?
      `)
      .bind(id)
      .first<Department>();
    
    if (!department) {
      return c.json({ success: false, error: 'القسم غير موجود' }, 404);
    }
    
    return c.json({ success: true, data: department });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في جلب القسم' }, 500);
  }
});

// Create department
departments.post('/', checkPermission('departments', 'create'), async (c) => {
  try {
    const data = await c.req.json<Partial<Department>>();
    const db = c.env.DB;
    
    if (!data.name || !data.name_ar) {
      return c.json({ success: false, error: 'يجب إدخال اسم القسم' }, 400);
    }
    
    const result = await db
      .prepare(`
        INSERT INTO departments (name, name_ar, description, manager_id, parent_department_id, budget, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        data.name,
        data.name_ar,
        data.description || null,
        data.manager_id || null,
        data.parent_department_id || null,
        data.budget || 0,
        getCurrentDateTime(),
        getCurrentDateTime()
      )
      .run();
    
    return c.json({ 
      success: true, 
      message: 'تم إضافة القسم بنجاح',
      data: { id: result.meta.last_row_id }
    }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في إضافة القسم' }, 500);
  }
});

// Update department
departments.put('/:id', checkPermission('departments', 'update'), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json<Partial<Department>>();
    const db = c.env.DB;
    
    await db
      .prepare(`
        UPDATE departments SET
          name = COALESCE(?, name),
          name_ar = COALESCE(?, name_ar),
          description = COALESCE(?, description),
          manager_id = COALESCE(?, manager_id),
          parent_department_id = COALESCE(?, parent_department_id),
          budget = COALESCE(?, budget),
          updated_at = ?
        WHERE id = ?
      `)
      .bind(
        data.name || null,
        data.name_ar || null,
        data.description || null,
        data.manager_id || null,
        data.parent_department_id || null,
        data.budget || null,
        getCurrentDateTime(),
        id
      )
      .run();
    
    return c.json({ success: true, message: 'تم تحديث القسم بنجاح' });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في تحديث القسم' }, 500);
  }
});

// Delete department
departments.delete('/:id', checkPermission('departments', 'delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    
    await db
      .prepare('UPDATE departments SET is_active = 0, updated_at = ? WHERE id = ?')
      .bind(getCurrentDateTime(), id)
      .run();
    
    return c.json({ success: true, message: 'تم حذف القسم بنجاح' });
  } catch (error) {
    return c.json({ success: false, error: 'خطأ في حذف القسم' }, 500);
  }
});

export default departments;
