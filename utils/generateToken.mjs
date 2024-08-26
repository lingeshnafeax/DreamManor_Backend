import jwt from "jsonwebtoken";
export const generateToken = (id, isAdmin = true, expiresIn = "7d") => {
  const token = jwt.sign(
    {
      id,
      isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: expiresIn,
    }
  );
  return token;
};
