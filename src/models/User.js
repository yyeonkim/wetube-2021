import mongoose from "mongoose";
import bcyrpt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  console.log("User's password:", this.password);
  this.password = await bcyrpt.hash(this.password, 10);
  console.log("Hashed password:", this.password);
});

const User = mongoose.model("User", userSchema);

export default User;
