import express from "express";
import {
  getUserInfo,
  login,
  logout,
  register,
} from "../controllers/authController.mjs";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/userInfo", getUserInfo);

authRouter.post("/logout", logout);

export default authRouter;
