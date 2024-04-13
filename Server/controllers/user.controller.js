import bcrypt from 'bcryptjs';

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

        const upadtedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        const { password, ...rest } = upadtedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}