const {Router} = require('express');
const { addPost, getPostWithId, updatePost, deletePost, addPostProcess, updatePostProcess } = require('../controllers/post.controller');
const { isAuthenticated } = require('../middelwares/auth.middleware');

const postRoute = Router({ mergeParams: true });

// postRoute.get('/',getPost);

postRoute.get('/', addPost);
postRoute.post('/', addPostProcess);

// postRoute.get('/:postId', ()=>console.log("in post1"), getPostWithId);

postRoute.get('/:postId', isAuthenticated, updatePost);

postRoute.put('/:postId',isAuthenticated, updatePostProcess);

postRoute.delete('/:postId',isAuthenticated, deletePost);

exports.postRoute = postRoute;