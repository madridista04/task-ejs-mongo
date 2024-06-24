const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const createError = require('http-errors');
const { getSuccessResponse } = require("../utils/response");

exports.addPost = async (req, res, next) => {
  try {
    res.render('add-post', { loggedIn: req.user[0] });
  } catch (error) {
    next(error)
  }
};

exports.addPostProcess = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const payload = req.body;
    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    await postModel.create({ userId, ...payload });

    return res.redirect("/feed")
  } catch (error) {
    next(error)
  }
};

exports.getPostWithId = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    const post = await postModel.findById(postId);
    if (!post) throw createError(404, "Post does not exists");

    const getPost = await postModel.findById(postId);
    return res.json(getSuccessResponse("Post fetched Succesfully", getPost));
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const user = req.user[0];
    const { postId } = req.params;

    const post = await postModel.findById(postId);

    res.render("updatePost", { postData: post, loggedIn: user });
  } catch (error) {
    next(error);
  }
};

exports.updatePostProcess = async (req, res, next) => {
  try {
    const userId = req.user[0]._id;
    const { postId } = req.params;
    const payload = req.body;
    const options = { new: true };

    const post = await postModel.findById(postId);

    const updatedPost = await postModel.findOneAndUpdate(
      { _id: postId, userId: userId },
      { $set: payload },
      { options }
    );

    res.redirect('/feed');

  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { _id } = req.user[0];

    const post = await postModel.findById(req.params.postId);

    if (post.userId.toString() === _id.toString() || req.user[0].role === "admin") {
      await Promise.all([
        postModel.findOneAndUpdate({ _id: req.params.postId }, { isDelete: true }),
        commentModel.updateMany({ postId: req.params.postId }, { isDelete: true })
      ])
    }

    return res.redirect("/feed");

  } catch (error) {
    next(error);
  }
};

