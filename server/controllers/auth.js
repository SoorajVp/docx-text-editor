import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";

const GoogleLogin = async (req, res, next) => {
    try {
        const { given_name, family_name, name, email, picture } = req.body
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ given_name, family_name, name, email, picture })
        }
        const token = generateToken(user?.id);
        res.status(201).json({ message: `${given_name} signed in successfully `, user, token })
    } catch (error) {
        next(error)
    }
}

export default { GoogleLogin }