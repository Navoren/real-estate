import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json({
            message: "User created successfully!"
        });
    } catch (error) {
        throw new ApiError(400, error.message);
    }
    res.status(200).json({
        message: "Signup success"
    });
}