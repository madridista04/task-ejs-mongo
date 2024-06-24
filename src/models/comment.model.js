const {mongoose, Schema} = require('mongoose');

const commentSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref: "postModel",
        required: true
    },
    comment:{
        type: String,
        required: true,
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('commentModel',commentSchema);