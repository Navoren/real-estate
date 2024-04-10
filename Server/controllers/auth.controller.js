import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json({
            message: "User created successfully!"
        });
    } catch (error) {
        throw new ApiError(400, error.message);
    }
};


export const signin = async (req, res) => { 
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(400, "Invalid credentials");
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: userPassword, ...userWithoutPassword } = user._doc;
        res.cookie("accessToken", token, {
            httpOnly: true
        })
        .status(200).json({
            message: "User signed in successfully!",
            user: userWithoutPassword,
          });

    } catch (error) {
        throw new ApiError(400, error.message);
    }
};