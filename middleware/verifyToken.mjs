import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
    req.user = payload;
    next();
  });
};

export default verifyToken;
