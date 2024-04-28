import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.send("Hello from user controller")
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return res.status(403).json("You can only update your account!")
    }
    try {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return res.status(403).json("You can only delete your account!")
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("accessToken");
        res.status(200).json("User has been deleted...");
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}

export const getListingsByUser = async (req, res, next) => { 
    if(req.user.id !== req.params.id) {
        return res.status(403).json("You can only view your listings!")
    }
    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}
