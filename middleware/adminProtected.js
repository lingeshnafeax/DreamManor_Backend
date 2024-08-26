const adminProtected = (req, res, next) => {
  const { user } = req;
  if (!user || !user.isAdmin) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  next();
};
export default adminProtected;
