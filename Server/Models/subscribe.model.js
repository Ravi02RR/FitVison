import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
    Email: {
        type: String,
        required: true
    }
});

const subsModel = mongoose.model('Subs', subscribeSchema);

export default subsModel;