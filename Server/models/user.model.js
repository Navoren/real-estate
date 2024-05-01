import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1712860114~exp=1712860714~hmac=26f757ea431465d29a2f74c35bc597578d896be9aef7d183ee1c87c4869de9d1",
    },
    password: {
        type: String,
        required: [
            true, "Password is Required"
        ]
    },
    refreshToken: {
        type: String,
    }

},
    {
    timestamps: true,
    })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
    })

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generatedAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    )
}

userSchema.methods.generatedRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: '1d'
        }
    )
}

export default mongoose.model("User", userSchema);