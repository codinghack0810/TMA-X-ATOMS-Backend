import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    telID: {
        type: String,
        required: [true, "Telegram ID is Required."],
        unique: true
    },
    username: {
        type: String,
        required: [true, "Username is Required."]
    },
    wallet: {
        type: String,
        required: [true, "Wallet is Required."],
        unique: true
    },
    dailyLimit: {
        type: Number,
        min: 0,
        max: 50,
        default: 50
    },
    tokenBalance: {
        type: Number,
        default: 0
    },
    loginNum: {
        type: Number,
        default: 1
    },
    lastLoginDate: {
        type: Number,
    }
})

const User = mongoose.model("User", UserSchema);

export default User;