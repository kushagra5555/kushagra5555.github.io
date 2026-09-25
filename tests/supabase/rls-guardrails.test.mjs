import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const migration = fs.readFileSync(
  '/home/runner/work/kushagra5555.github.io/kushagra5555.github.io/supabase/migrations/20260925070000_init.sql',
  'utf8'
);

test('payments/enrollments client writes are blocked in migration policies', () => {
  assert.ok(migration.includes('create policy payments_no_client_writes'));
  assert.ok(migration.includes('create policy enrollments_no_client_writes'));
});

test('courses have published public read and admin write policy', () => {
  assert.ok(migration.includes('create policy courses_public_read'));
  assert.ok(migration.includes('create policy courses_admin_all'));
});
