import moongoose from "mongoose";

const Schema = moongoose.Schema;

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    twitter: {
        type: Boolean,
        default: false
    },
    telegram: {
        type: Boolean,
        default: false
    },
});

const Task = moongoose.model("tasks", TaskSchema);
export default Task;