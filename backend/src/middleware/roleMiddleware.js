const ensureEmployee = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "Employee") {
      return res.status(403).json({ message: "Access denied. Employees only." });
    }
    next();
  };
  
  const ensureAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
  
  module.exports = { ensureEmployee, ensureAdmin };
  