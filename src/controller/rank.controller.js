import User from "../model/UserInfo.js";

export const test = (req, res) => {
    res.send("rank route is working fine");
}

export const ranking = async (req, res) => {
    try {
        const userRanking = await User.find().sort({ tokenBalance: -1 });
        res.status(200).json({ userRanking });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}