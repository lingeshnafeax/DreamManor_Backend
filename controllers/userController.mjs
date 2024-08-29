import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.mjs";
import { hashPassword } from "../utils/hashPassword.mjs";

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
const updateUserInfo = async (req, res) => {
  if (req.user && req.user.id) {
    const id = req.user.id;
    const { password, ...userData } = req.body;
    if (password) {
      const hashedPassword = await hashPassword(password);
      userData.password = hashedPassword;
    }
    try {
      await prisma.user.update({
        where: {
          id,
        },
        data: userData,
      });
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

export { getUserDetails, updateUserInfo };
