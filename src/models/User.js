import mongoose from "mongoose";
import bcyrpt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: {
    type: String,
    default:
      "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdIPSp7%2FbtrdwTOabj5%2Fe17j64FP5b4uCOc18K8XKk%2Fimg.png",
  },
  socialOnly: { type: Boolean, default: false },
  userId: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String, required: true, unique: true },
  location: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcyrpt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
