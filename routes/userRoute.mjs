import express from "express";
import verifyToken from "../middleware/verifyToken.mjs";
import { getUserDetails } from "../controllers/userController.mjs";
const userRouter = express.Router();

userRouter.get("/userInfo", verifyToken, getUserDetails);
export default userRouter;
