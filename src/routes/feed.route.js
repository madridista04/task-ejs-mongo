const Router = require('express');
const {  isAuthenticated } = require('../middelwares/auth.middleware');
const { getFeed } = require('../controllers/feed.controller');
const feedRoute = Router();


feedRoute.use('/feed',isAuthenticated,getFeed)

exports.feedRoute = feedRoute;