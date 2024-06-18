import User from "../model/UserInfo.js";
import { getDate } from "../utils/getDate.js";

export const test = (req, res) => {
    res.send("user route is working fine");
}

export const login = async (req, res) => {
    const { telID, username, wallet, dateNum } = req.body;
    try {
        const user = await User.findOne({ wallet });
        if (user) {
            const loginDate = getDate();
            const lastLoginDate = user.lastLoginDate;
            if (loginDate - lastLoginDate == 1) {
                user.loginNum < 5 ? user.loginNum++ : user.loginNum = 5;
                user.dailyLimit = 50;
            } else if (loginDate - lastLoginDate >= 2) {
                user.loginNum = 1;
                user.dailyLimit = 50;
            }
            user.lastLoginDate = loginDate;
            await user.save().then(() => {
                res.status(200).send({ user });
            });
        } else {
            const newUser = new User({ telID, username, wallet });
            newUser.lastLoginDate = getDate();
            await newUser.save().then(() => {
                res.status(200).send({ newUser });
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}