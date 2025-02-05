import User from "../models/user.js";
import helper from "../utils/helper.js";

const GetUserDetails = async (req, res, next) => {
    try {
        const _id = req.userId
        let user = await User.findById(_id)
        res.status(200).json({ message: `Profile Details fetched`, user })
    } catch (error) {
        next(error)
    }
}

const UpdateUser = async (req, res, next) => {
    try {
        const { given_name, family_name, theme } = req.body;
        const _id = req.userId;

        const user_details = {
            name: given_name + " " + family_name,
            given_name, family_name, theme
        }

        if (req.file) {
            const result = await helper.uploadImageToCloudinary(req.file.buffer)
            user_details.picture = result.secure_url
        }
        let user = await User.findByIdAndUpdate(_id, user_details, {new: true})

        res.status(201).json({ message: `Profile updated successfully `, user })
    } catch (error) {
        next(error)
    }
}

export default { GetUserDetails, UpdateUser }