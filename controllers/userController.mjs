import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.mjs";

const getUserDetails = async (req, res) => {
  if (req.cookies && req.cookies.token) {
    try {
      jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET_KEY,
        async (err, payload) => {
          if (err) {
            return res
              .status(401)
              .json({ success: false, message: "Not authorized" });
          }
          const id = payload.id;
          const user = await prisma.user.findUnique({
            where: {
              id,
            },
          });
          return res.status(200).json({
            success: true,
            user: {
              id: user.id,
              avatar: user.avatar,
              username: user.username,
              email: user.email,
            },
          });
        }
      );
    } catch (err) {
      console.log("Token not found. Login using username and password");
    }
  }
};

export { getUserDetails };
