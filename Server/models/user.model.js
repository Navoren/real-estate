import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1712860114~exp=1712860714~hmac=26f757ea431465d29a2f74c35bc597578d896be9aef7d183ee1c87c4869de9d1",
    },

},{timestamps: true});

export default mongoose.model("User", userSchema);