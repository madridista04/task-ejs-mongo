const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");

exports.getFeed = async (req, res, next) => {
    try {
        const { page = 1, limit = 5 } = req.query;

        const postData = await postModel.find({ isDelete: false }).populate('userId').lean().limit(limit * 1).skip((page - 1) * limit);
        if (!postData.length && page > 1) throw createError(404, 'error page not found');


        const commentData = await commentModel.find({ isDelete: false }).populate('userId');

        const postCount = await postModel.find({ isDelete: false }).count();
        const pages = Math.ceil(postCount / limit);

        res.render("feed", { posts: postData, comments: commentData, loggedIn: req.user[0] ,pages:pages});
    } catch (error) {
        next(error)
    }
}