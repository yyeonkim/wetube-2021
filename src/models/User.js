import mongoose from "mongoose";
import bcyrpt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: {
    type: String,
    default:
      "https://wetubecc.s3.us-east-2.amazonaws.com/images/default-profile.png",
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
