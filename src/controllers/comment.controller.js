const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const createError = require('http-errors');
const { getSuccessResponse } = require("../utils/response");

exports.getComment = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.find({ postId });
        return res.json(getSuccessResponse("Post fetched Succesfully", comment));
    } catch (error) {
        next(error);
    }
};

exports.addComment = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        const payload = req.body;

        await commentModel.create({ userId, postId, ...payload });
        return res.redirect("/feed");
    } catch (error) {
        next(error);
    }
};


exports.getCommentById = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.findById(commentId);
        if (!comment) throw createError(404, "Comment does not exists");

        return res.json(getSuccessResponse("Comment fetched Succefsully", comment));
    } catch (error) {
        next(error);
    }
};


exports.updateComment = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;

        const payload = req.body;
        const options = { new: true };

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.findById(commentId);
        if (!comment) throw createError(404, "Comment does not exists");

        const updatedComment = await commentModel.findOneAndUpdate(
            { _id: commentId, userId: userId },
            { $set: payload },
            { options }
        );
        if (!updatedComment) throw createError(404, "Not Authorized user");

        return res.json(getSuccessResponse("Comment Updated Succesfully", updatedComment));
    } catch (error) {
        next(error);
    }
};


exports.deleteComment = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;

        const usersPost = await postModel.findOne({ _id: postId, userId: userId }).lean();
        const comment = await commentModel.findOne({ _id: commentId }).lean();

        if (req.user[0].role === "admin" || req.user[0]._id.toString() === comment.userId.toString() ||
            usersPost.userId.toString() === req.user[0]._id.toString()) {

            await commentModel.findByIdAndUpdate({ _id: commentId }, { $set: { isDelete: true } })

            return res.redirect("/feed");
        } else {

            throw createError(404, "Not Authorized user");
        }
    } catch (error) {
        next(error)
    }
};
