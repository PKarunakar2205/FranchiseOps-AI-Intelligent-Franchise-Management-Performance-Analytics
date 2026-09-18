/**
 * Role-Based Access Control (RBAC) Middleware for FranchiseOpsAI
 * Supported Roles: 'Admin', 'Regional Manager', 'Outlet Manager', 'Staff'
 */

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. User not logged in."
      });
    }

    const userRole = req.user.role;

    // Admin has full access to all endpoints
    if (userRole === "Admin") {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${userRole}' is not authorized for this resource.`
      });
    }

    next();
  };
};

const checkOutletAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required."
    });
  }

  const { role, assigned_outlet_id } = req.user;
  const requestedOutletId = parseInt(req.params.id || req.params.outletId || req.query.outlet_id || req.body.outlet_id, 10);

  // Admin and Regional Manager can access all outlets
  if (role === "Admin" || role === "Regional Manager") {
    return next();
  }

  // Outlet Manager & Staff are restricted to their assigned outlet if specified
  if (assigned_outlet_id && requestedOutletId && assigned_outlet_id !== requestedOutletId) {
    return res.status(403).json({
      success: false,
      message: `Access denied. You are only authorized to access assigned outlet ID ${assigned_outlet_id}.`
    });
  }

  next();
};

module.exports = {
  authorizeRoles,
  checkOutletAccess
};
