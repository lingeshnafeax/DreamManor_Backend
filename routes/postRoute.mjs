import { Router } from "express";
import verifyToken from "../middleware/verifyToken.mjs";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/postController.mjs";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/", verifyToken, createPost);
postRouter.get("/:id", getPost);
postRouter.patch("/:id", verifyToken, updatePost);
postRouter.delete("/:id", verifyToken, deletePost);

export default postRouter;
