import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "회원가입" });

export const postJoin = async (req, res) => {
  const { username, userId, email, password, password2, location } = req.body;
  const pageTitle = "회원가입";
  if (password !== password2) {
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    return res.status(400).redirect("/join");
  }
  const exists = await User.exists({ $or: [{ userId }, { email }] });
  if (exists) {
    req.flash("error", "이미 사용 중인 아이디/이메일입니다.");
    return res.status(400).redirect("/join");
  }
  try {
    await User.create({
      username,
      userId,
      email,
      password,
      location,
    });
    req.flash("info", "회원가입이 완료되었습니다.");
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", error._message);
    return res.status(400).redirect("/join");
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "로그인" });

export const postLogin = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    req.flash("error", "존재하지 않는 계정입니다");
    return res.status(400).redirect("/login");
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    return res.status(400).redirect("/login");
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      req.flash("error", "이메일 정보가 없습니다.");
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        username: userData.name,
        userId: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    req.flash("error", "존재하지 않는 계정입니다.");
    return res.redirect("/login");
  }
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", {
    pageTitle: "프로필 편집",
  });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, email: sessionEmail, avatarUrl },
    },
    body: { username, email, location },
    file,
  } = req;
  if (sessionEmail !== email) {
    const exists = await User.exists({ $or: [{ email }] });
    if (exists) {
      req.flash("error", "이미 사용 중인 아이디/이메일입니다.");
      return res.status(400).redirect("edit-profile");
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      username,
      email,
      location,
      avatarUrl: file ? file.path : avatarUrl,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "비밀번호 변경" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newComfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    req.flash("error", "현재 비밀번호가 일치하지 않습니다.");
    return res.status(400).redirect("/users/change-password");
  }
  if (newPassword !== newComfirmation) {
    req.flash("error", "새 비밀번호가 일치하지 않습니다.");
    return res.status(400).redirect("/users/change-password");
  }
  user.password = newPassword;
  await user.save();
  req.flash("info", "비밀번호가 변경되었습니다.");
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res
      .status(404)
      .render("404", { pageTitle: "존재하지 않는 회원입니다." });
  }
  return res.render("users/profile", { pageTitle: "프로필", user });
};
