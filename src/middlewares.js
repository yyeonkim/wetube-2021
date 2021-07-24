import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// 로그인한 유저만 접속 가능
export const protectorMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }
  next();
};

// 로그아웃 된 유저만 접속 가능
export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  next();
};

export const uploadFiles = multer({ dest: "uploads/" });
