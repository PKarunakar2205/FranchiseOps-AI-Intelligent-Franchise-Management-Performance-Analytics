const { authorizeRoles } = require("./rbacMiddleware");

const roleMiddleware = (...roles) => {
  return authorizeRoles(...roles);
};

module.exports = roleMiddleware;