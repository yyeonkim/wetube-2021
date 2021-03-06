import express from "express";
import {
  see,
  logout,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
  deleteUser,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
  s3DeleteImage,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), s3DeleteImage, postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.get(`/delete`, protectorMiddleware, deleteUser);

export default userRouter;
