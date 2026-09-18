const assert = require('assert');
const { authorizeRoles, checkOutletAccess } = require('./middleware/rbacMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

function createMockContext({ user, params = {}, query = {}, body = {} } = {}) {
  const req = { user, params, query, body };
  let status = null;
  let json = null;
  let nextCalled = false;

  const res = {
    status(code) {
      status = code;
      return this;
    },
    json(data) {
      json = data;
      return this;
    }
  };

  const next = () => {
    nextCalled = true;
  };

  return { req, res, next, getResult: () => ({ status, json, nextCalled }) };
}

function runTests() {
  console.log("=== Running RBAC Middleware Unit Tests ===");
  let passedCount = 0;

  const test = (description, fn) => {
    try {
      fn();
      console.log(`[PASS] ${description}`);
      passedCount++;
    } catch (err) {
      console.error(`[FAIL] ${description}`);
      throw err;
    }
  };

  // 1. authorizeRoles tests
  test("authorizeRoles: Reject unauthenticated user with 401", () => {
    const middleware = authorizeRoles("Admin", "Regional Manager");
    const { req, res, next, getResult } = createMockContext();
    middleware(req, res, next);

    const result = getResult();
    assert.strictEqual(result.status, 401);
    assert.strictEqual(result.json.success, false);
    assert.strictEqual(result.nextCalled, false);
  });

  test("authorizeRoles: Allow Admin role unconditionally", () => {
    const middleware = authorizeRoles("Regional Manager");
    const { req, res, next, getResult } = createMockContext({ user: { role: "Admin" } });
    middleware(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
    assert.strictEqual(result.status, null);
  });

  test("authorizeRoles: Allow matching user role", () => {
    const middleware = authorizeRoles("Regional Manager", "Outlet Manager");
    const { req, res, next, getResult } = createMockContext({ user: { role: "Regional Manager" } });
    middleware(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
  });

  test("authorizeRoles: Reject non-matching user role with 403", () => {
    const middleware = authorizeRoles("Regional Manager", "Outlet Manager");
    const { req, res, next, getResult } = createMockContext({ user: { role: "Staff" } });
    middleware(req, res, next);

    const result = getResult();
    assert.strictEqual(result.status, 403);
    assert.strictEqual(result.json.success, false);
    assert.strictEqual(result.nextCalled, false);
  });

  // 2. roleMiddleware test (wrapper around authorizeRoles)
  test("roleMiddleware: Wrapper function behaves correctly", () => {
    const middleware = roleMiddleware("Admin", "Regional Manager");
    const { req, res, next, getResult } = createMockContext({ user: { role: "Regional Manager" } });
    middleware(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
  });

  // 3. checkOutletAccess tests
  test("checkOutletAccess: Reject unauthenticated user with 401", () => {
    const { req, res, next, getResult } = createMockContext();
    checkOutletAccess(req, res, next);

    const result = getResult();
    assert.strictEqual(result.status, 401);
    assert.strictEqual(result.json.success, false);
    assert.strictEqual(result.nextCalled, false);
  });

  test("checkOutletAccess: Allow Admin to access any outlet", () => {
    const { req, res, next, getResult } = createMockContext({
      user: { role: "Admin", assigned_outlet_id: 1 },
      params: { outletId: "999" }
    });
    checkOutletAccess(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
  });

  test("checkOutletAccess: Allow Regional Manager to access any outlet", () => {
    const { req, res, next, getResult } = createMockContext({
      user: { role: "Regional Manager", assigned_outlet_id: 1 },
      params: { outletId: "50" }
    });
    checkOutletAccess(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
  });

  test("checkOutletAccess: Allow Staff to access assigned outlet", () => {
    const { req, res, next, getResult } = createMockContext({
      user: { role: "Staff", assigned_outlet_id: 10 },
      params: { outletId: "10" }
    });
    checkOutletAccess(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
  });

  test("checkOutletAccess: Reject Staff from accessing unassigned outlet with 403", () => {
    const { req, res, next, getResult } = createMockContext({
      user: { role: "Staff", assigned_outlet_id: 10 },
      params: { outletId: "20" }
    });
    checkOutletAccess(req, res, next);

    const result = getResult();
    assert.strictEqual(result.status, 403);
    assert.strictEqual(result.json.success, false);
    assert.strictEqual(result.nextCalled, false);
  });

  test("checkOutletAccess: Check query and body params fallback", () => {
    const { req, res, next, getResult } = createMockContext({
      user: { role: "Outlet Manager", assigned_outlet_id: 15 },
      query: { outlet_id: "15" }
    });
    checkOutletAccess(req, res, next);

    const result = getResult();
    assert.strictEqual(result.nextCalled, true);
  });

  console.log(`\nAll ${passedCount} RBAC tests completed successfully!`);
}

runTests();
