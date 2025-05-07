import userModel from "../models/userModel.js";

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.findById(req.body.userId);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

export default roleMiddleware;
