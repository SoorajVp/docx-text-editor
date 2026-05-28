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

const GetUserList = async (req, res, next) => {
    try {

        const { search = '' } = req.query;

        const userId = req.userId;

        const users = await User.find({
            _id: { $ne: userId }, // exclude current user

            email: { $exists: true },

            $or: [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
            ],
        })
            .select("_id name email picture");

        res.status(200).json({
            message: 'User List fetched',
            users
        });

    } catch (error) {
        next(error);
    }
};

const UpdateUser = async (req, res, next) => {
    try {
        const { first_name, last_name, theme } = req.body;
        const _id = req.userId;

        const user_details = {
            name: first_name + " " + last_name,
            first_name, last_name, theme
        }

        if (req.file) {
            console.log("this is file buffer ", req.file)
            const { buffer, originalname, mimetype } = req.file
            const result = await helper.cloudinaryUpload(buffer, originalname, "pictures")
            user_details.picture = result.secure_url
        }
        let user = await User.findByIdAndUpdate(_id, user_details, {new: true})

        res.status(201).json({ message: `Profile updated successfully `, user, toast: true })
    } catch (error) {
        next(error)
    }
}

export default { GetUserDetails, GetUserList, UpdateUser }