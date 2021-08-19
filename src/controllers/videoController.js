import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "asc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });
  if (!video) {
    return res.render("404", { pageTitle: "영상을 찾을 수 없습니다." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "영상을 찾을 수 없습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `편집하기: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "영상을 찾을 수 없습니다." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "영상 업로드" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const { video, thumb } = req.files;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo);
    user.save();
    return res.redirect("/");
  } catch (error) {
    req.flash("error", error._message);
    return res.status(400).redirect("upload");
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "영상을 찾을 수 없습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  req.flash("info", "삭제되었습니다.");
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "검색하기", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "영상을 찾을 수 없습니다.");
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  let comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  comment = await Comment.findById(comment._id).populate("owner");
  return res.status(201).json(comment);
};

export const deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    req.flash("error", "존재하지 않는 영상입니다.");
    return res.sendStatus(400);
  }
  video.comments.remove(commentId);
  video.save();

  const comment = await Comment.findById(commentId);
  if (!comment) {
    req.flash("error", "댓글을 찾을 수 없습니다.");
    return res.sendStatus(400);
  }
  await Comment.findByIdAndDelete(commentId);
  return res.sendStatus(200);
};

export const editComment = async (req, res) => {
  const { videoId, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    req.flash("error", "댓글을 찾을 수 없습니다.");
    return res.sendStatus(400);
  }
  // edit comment
  // update video
  return res.sendStatus(200);
};
