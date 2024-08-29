import express from "express";
import verifyToken from "../middleware/verifyToken.mjs";
import {
  getUserDetails,
  updateUserInfo,
} from "../controllers/userController.mjs";
const userRouter = express.Router();

userRouter.get("/userInfo", verifyToken, getUserDetails);
userRouter.patch("/updateInfo", verifyToken, updateUserInfo);
export default userRouter;
