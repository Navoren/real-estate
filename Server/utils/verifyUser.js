import jwt from 'jsonwebtoken';
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from './ApiError.js';
import User from "../models/user.model.js";


export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = await req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized Request");
        }
    
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})