import moongoose from "mongoose";

const Schema = moongoose.Schema;

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    twitterHandle: {
        type: String,
        default: ""
    },
    telegram: {
        type: Boolean,
        default: false
    },
    btcWallet: {
        type: String,
        default: ""
    },
    websiteVisited: {
        type: Boolean,
        default: false
    },
    emailAddress: {
        type: String,
        default: ""
    },
    telegramId: {
        type: String,
        default: ""
    },
    mintXATOMS: {
        type: Boolean,
        default: false
    }
});

const Task = moongoose.model("tasks", TaskSchema);
export default Task;