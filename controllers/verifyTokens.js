import jwt from "jsonwebtoken";

// For middleware usage (with next)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );
    req.user = decoded;
    console.log(req.user);
    next(); // Move to next middleware or route handler
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// For direct route usage (without next) - for auth routes
export const verifyTokenDirect = (req, res) => {
  const token = req.headers.auth; // Based on your frontend code
  console.log("Token", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );
    req.user = decoded;
    console.log(req.user);
    return res.status(200).json({
      message: "Token verified",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
