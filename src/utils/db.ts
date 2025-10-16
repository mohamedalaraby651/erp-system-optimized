// ============================================
// Database Utilities
// ============================================

export function generateCode(prefix: string, lastNumber: number): string {
  const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
  return `${prefix}${nextNumber}`;
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

export function buildWhereClause(filters: Record<string, any>): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  }
  
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

export function buildPaginationClause(page: number = 1, limit: number = 10): { offset: number; limit: number } {
  const offset = (page - 1) * limit;
  return { offset, limit };
}

export async function executeTransaction(
  db: D1Database,
  operations: Array<{ sql: string; params?: any[] }>
): Promise<boolean> {
  try {
    // Note: D1 doesn't support traditional transactions yet
    // We'll execute operations sequentially
    for (const operation of operations) {
      const stmt = db.prepare(operation.sql);
      if (operation.params) {
        await stmt.bind(...operation.params).run();
      } else {
        await stmt.run();
      }
    }
    return true;
  } catch (error) {
    console.error('Transaction error:', error);
    return false;
  }
}

export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function parseSearchQuery(query: string): string {
  // Escape special characters and add wildcards for LIKE query
  return `%${query.replace(/[%_]/g, '\\$&')}%`;
}
