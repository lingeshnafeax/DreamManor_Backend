import express from "express";
import {
  getUserInfo,
  login,
  logout,
  register,
} from "../controllers/authController.mjs";
import verifyToken from "../middleware/verifyToken.mjs";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/userInfo", verifyToken, getUserInfo);

authRouter.post("/logout", logout);

export default authRouter;
