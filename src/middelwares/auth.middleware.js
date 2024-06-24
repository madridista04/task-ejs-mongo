const createError = require('http-errors');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user.model');
require('dotenv').config();


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, cb) => {
        try {
            const valideEmail = await userModel.findOne({ email, isDelete: false });
            if (!valideEmail) throw createError(404, 'Enter proper Credentials');

            const validePassword = await valideEmail.checkPassword(password);
            if (!validePassword) throw createError(404, 'Enter proper Credentials');

            cb(null, valideEmail);
        } catch (error) {
            cb(error)
        }
    }),
)

passport.serializeUser((user, done) => {
    if(user) done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.find({ _id: id, isDelete: false });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

exports.isAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) return next();
        res.redirect('/users/login');
    } catch (error) {
        next(error);
    }
}

exports.checkLogIn = (req, res, next) => {
    try {
        if (req.isAuthenticated()) return res.redirect('/feed');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.authorization = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user[0];
            
            if (!roles.includes(user.role)) throw createError("Not Authorized");

            next();
        } catch (error) {
            next(error);
        }
    }
}





