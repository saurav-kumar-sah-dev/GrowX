import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "growx_jwt_secret_key_2024";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    if (decoded.role !== "admin" && decoded.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default isAdmin;
