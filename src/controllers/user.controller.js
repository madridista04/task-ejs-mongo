const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const createError = require('http-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const { getSuccessResponse, getFailuerResponse } = require("../utils/response");

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const users = await userModel.find({ isDelete: false }, { isDelete: 0, __v: 0 }).lean().limit(limit * 1).skip((page - 1) * limit);
    if (!users.length && page > 1) throw createError(404, 'error page not found');

    const userCount = await userModel.find({ isDelete: false }).count();
    const pages = Math.ceil(userCount / limit);

    return res.render('user', { users: users, loggedIn: req.user[0], pages: pages });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = req.flash('error');
  return res.render('login', { errors });
}

exports.logout = (req, res, next) => {
  res.clearCookie("connect.sid");
  req.logout((err) => {
    if (err) return next(err)
    req.session.destroy((err) => {
      res.redirect('login');
    })
  })
}

exports.getTokenFromRefreshToken = async (req, res, next) => {
  const userId = req.user._id;

  const accessToken = createAccessToken(userId.toString());
  const refreshToken = createRefreshToken(userId.toString());

  res.json(getSuccessResponse({ Tokens: { ACCESS_TOKEN: accessToken, REFRESH_TOKEN: refreshToken } }));
}

exports.addUser = async (req, res, next) => {
  try {
    const errors = req.flash('error');

    res.render('register', {
      errors,
      formData: {
        username: "",
        email: "",
        phone: "",
        password: "",
        address: ""
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.addUserProcess = async (req, res, next) => {
  const { username = "", email = "", phone = "", password = "", address = "" } = req.body;
  try {
    console.log(req.body);
    const errors = req.flash('error');

    if (errors) {
      const user = userModel.findOne(req.body.email);
      if (!user) {
        await userModel.create(req.body);
        res.redirect('/users/login');
      }
      else {
        const errors = ["Email already in use"];
        res.render("register", {
          errors,
          formData: {
            username,
            email,
            phone,
            address
          },
        });
      }
    }

    return res.render("register", {
      errors,
      formData: {
        username,
        email,
        phone,
        address
      },
    });
  } catch (error) {
    next(error);
  }
}

exports.getUserWithId = async (req, res, next) => {
  try {
    const message = req.flash("message");
    
    res.render('profile', { loggedIn: req.user[0], message: message });

  } catch (error) {
    next(error);
  }

};

exports.updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user[0];
    const payload = req.body;
    const options = { new: true };

    if (_id.toString() === req.params.userId) {
      const result = await userModel.findByIdAndUpdate(_id, payload, options);

      req.flash("message","Profile Updated Successfully");

      return res.redirect(`/users/${_id}`);

    } else {
      throw createError.Unauthorized();
    }
  } catch (error) {
    next(error);
  }

};

exports.deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.user[0];
    const userId = req.params.userId;

    console.log(_id);
    console.log(userId);
    if (_id.toString() === userId || req.user[0].role === "admin") {
      await Promise.all([
        userModel.findByIdAndUpdate(userId, { isDelete: true }),
        postModel.updateMany({ userId: userId }, { isDelete: true }),
        commentModel.updateMany({ userId: userId }, { isDelete: true })
      ]);
      return res.redirect("/users");
    } else {
      throw createError.Unauthorized();
    }

  } catch (error) {
    next(error);
  }
};

