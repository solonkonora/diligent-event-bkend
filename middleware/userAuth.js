// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     res.json({ success: false, message: "Not Authorized Login Again" });
//   }

//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//     if (tokenDecode.id) {
//       req.body.userId = tokenDecode.id;
//       req.body.role = tokenDecode.role;  // assuming the token includes the role
//     } else {
//       return res.json({ success: false, message: "Not Authorized ogin Again" });
//     }

//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export default userAuth;


import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(403).json({ success: false, message: "Token is invalid. Login again." });
    }

    // Attach user info to request (commonly done via req.user)
    req.user = {
      id: decoded.id,
      role: decoded.role || "user", // fallback to "user" if role isn't included
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token verification failed", error: error.message });
  }
};

export default userAuth;
