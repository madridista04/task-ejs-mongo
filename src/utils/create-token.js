// const jwt = require('jsonwebtoken');
// const client = require('../utils/redis-init');
// require('dotenv').config();

// exports.createAccessToken = (userId,role) => {
//     const payload = { userId, role };
//     const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '60s' });
//     return accessToken
// };

// exports.createRefreshToken = (userId,role) =>{
//     const payload = { userId , role };
//     const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '30d' });
//     client.set(userId, refreshToken, {EX:432000*60});
//     return refreshToken
// };