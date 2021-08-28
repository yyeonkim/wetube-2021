import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const isHeroku = process.env.NODE_ENV === "production";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
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

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetubecc/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetubecc/videos",
  acl: "public-read",
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 2000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limit: {
    fileSize: 12000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
