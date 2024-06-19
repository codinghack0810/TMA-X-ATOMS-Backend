import User from "../model/UserInfo.js";
import Task from "../model/Task.js";

export const test = (req, res) => {
    res.send("task route is working fine");
}

const task = async (req, res, type) => {
    const { wallet } = req.body;
    try {
        const user = await User.findOne({ wallet });
        const userId = user._id;
        const task = await Task.findOne({ user: userId });
        if (!task) {
            res.status(400).json({ error: "Task not found" });
        } else {
            if (!task[type]) {
                user.tokenBalance += 20;
            }
            await user.save();
            task[type] = true;
            await task.save();
            res.status(200).json({ user, task });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const twitter = (req, res) => {
    task(req, res, "twitter");
}

export const telegram = (req, res) => {
    task(req, res, "telegram");
}

export const btcWallet = async (req, res) => {
    const { wallet, btcWallet } = req.body;
    try {
        const user = await User.findOne({ wallet });
        if (!user.btcWallet) {
            user.tokenBalance += 20;
        }
        user.btcWallet = btcWallet;
        await user.save();
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}