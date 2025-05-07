const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const userRole = req.body.role || req.user?.role; // use wherever you store role after auth

    if (!roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    next();
  };
};

export default roleMiddleware;
