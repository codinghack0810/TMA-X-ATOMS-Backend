import User from "../model/UserInfo.js";
import Task from "../model/Task.js";
import { getDate } from "../utils/getDate.js";

export const test = (req, res) => {
    res.send("user route is working fine");
}

export const login = async (req, res) => {
    const { telID, username, wallet, dateNum } = req.body;
    try {
        const user = await User.findOne({ wallet });
        if (user) {
            const task = await Task.findOne({ user: user._id });
            if (!task) {
                const task = new Task({ user: user._id });
                user.task = task._id;
                await user.save();
                await task.save();
            }
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
            await user.save();
            res.status(200).send({ user, task });
        } else {
            const user = new User({ telID, username, wallet });
            user.lastLoginDate = getDate();
            const task = new Task({ user: user._id });
            user.task = task._id;
            await user.save();
            await task.save();
            res.status(200).send({ user, task });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}