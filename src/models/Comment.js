import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString("ko-KR"),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
