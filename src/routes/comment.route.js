const {Router} = require('express');
const { getComment, addComment, getCommentById, updateComment, deleteComment } = require('../controllers/comment.controller');

const commentRoute = Router({ mergeParams: true });

commentRoute.get('/',getComment);
commentRoute.post('/', addComment);
commentRoute.get('/:commentId', getCommentById);
commentRoute.put('/:commentId', updateComment);
commentRoute.delete('/:commentId', deleteComment);

exports.commentRoute = commentRoute;