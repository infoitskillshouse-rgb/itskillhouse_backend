import jwt from "jsonwebtoken";

// Extract Token Function
const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

export const isAdminAuthenticated = (req, res, next) => {

  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // Role Check
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins only"
      });
    }

    // ⭐ Important
    req.adminId = decoded.id;   // production style
    req.user = decoded;         // optional

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Session expired"
          : "Invalid token"
    });

  }
};