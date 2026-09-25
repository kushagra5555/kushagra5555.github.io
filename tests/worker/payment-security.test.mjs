import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function signature(secret, orderId, paymentId) {
  return createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

function grantEnrollmentIdempotent(state, userId, courseId) {
  const key = `${userId}:${courseId}`;
  if (state.has(key)) return false;
  state.add(key);
  return true;
}

test('valid hmac signature should verify and forged should fail', () => {
  const secret = 'test_secret';
  const orderId = 'order_1';
  const paymentId = 'pay_1';
  const sig = signature(secret, orderId, paymentId);

  assert.equal(constantTimeEqual(sig, signature(secret, orderId, paymentId)), true);
  assert.equal(constantTimeEqual(sig, signature(secret, orderId, 'pay_x')), false);
});

test('idempotent enrollment grant should only create once per user-course', () => {
  const enrollments = new Set();
  assert.equal(grantEnrollmentIdempotent(enrollments, 'u1', 'c1'), true);
  assert.equal(grantEnrollmentIdempotent(enrollments, 'u1', 'c1'), false);
  assert.equal(grantEnrollmentIdempotent(enrollments, 'u1', 'c2'), true);
});
