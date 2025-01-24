import User from "../models/user.js";

const GoogleLogin = async (req, res, next) => {
    try {
        const { given_name, family_name, name, email, picture } = req.body
        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({ given_name, family_name, name, email, picture })
        }

        res.json({ message: `${given_name} loggedin successfully `, user })
    } catch (error) {
        next(error)
    }
}

export default { GoogleLogin }