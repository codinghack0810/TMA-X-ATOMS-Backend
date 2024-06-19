import User from "../model/UserInfo.js";

export const test = (req, res) => {
    res.send("token route is working fine");
}

export const tokenBalance = async (req, res) => {
    const { wallet, tokenNum, dailyLimit } = req.body;
    try {
        const user = await User.findOne({ wallet });
        if (!user) {
            res.status(400).json({ error: "User not found" });
        } else {
            user.tokenBalance = tokenNum;
            user.dailyLimit = dailyLimit;
            await user.save().then(() => {
                res.status(200).json({ user });
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}