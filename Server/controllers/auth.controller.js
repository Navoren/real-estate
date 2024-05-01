import User from '../models/user.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

const generatedAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generatedAccessToken();
        const refreshToken = user.generatedRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh & access token");
    }
};

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const existiedUser  = await User.findOne({
        $or : [{username}, {email}]
    });

    if (existiedUser) {
        throw new ApiError(409, "User already exists")
    }
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

//TODO: CHANGE THE HTTPONLY TO TRUE IN PRODUCTION
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
        const { accessToken, refreshToken } = await generatedAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };
        
        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200).json({
            message: "User signed in successfully!",
                user: loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken,
          });

    } catch (error) {
        throw new ApiError(400, error.message);
    }
};


export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: "1d" });
            const { password: pass, ...rest } = user._doc;
            res
                .cookie("accessToken", token, {
                httpOnly: true
            })
            .status(200).json({
                message: "User signed in successfully!",
                user: rest,
            });
        } else {
            const password = email + process.env.JWT_SECRET;
            const generatedUsername = email.split("@")[0];
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username: generatedUsername, email, password: hashedPassword, avatar: req.body.photo });
            try {
                await user.save();
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
                const { password, ...newUser } = user._doc;
                res.cookie("accessToken", token, {
                    httpOnly: true
                }).status(200).json({
                    message: "User signed in successfully!",
                    user: newUser,
                });
            } catch (error) {
                throw new ApiError(400, error.message);
            }
        }
    } catch (error) {
        throw new ApiError(400, error.message);
    }
};

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const { accessToken, newRefreshToken } = await generatedAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options).
            json(new ApiResponse(
                200, { accessToken, refreshToken: newRefreshToken },
                "Access Token refreshed Successfully"
            ));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
    
});

export const signOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
                accessToken : undefined,
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut Successfully"))
})