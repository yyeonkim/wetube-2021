import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";
import { deleteUser } from "../controllers/userController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete",
  deleteComment
);
apiRouter.delete("/users/delete", deleteUser);

export default apiRouter;
