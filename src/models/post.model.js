const {mongoose, Schema} = require('mongoose');

const postSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('postModel',postSchema);