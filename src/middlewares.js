import multer from "multer";
import multerS3 from "multer-s3";
import aws, { ProcessCredentials } from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// 로그인한 유저만 접속 가능
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

// 로그아웃 된 유저만 접속 가능
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

const multerUploader = multerS3({
  s3: s3,
  bucket: "wetubecc",
  acl: "public-read",
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 2000000,
  },
  storage: multerUploader,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limit: {
    fileSize: 12000000,
  },
  storage: multerUploader,
});
