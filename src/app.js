const express = require('express');
const app = express();
const methodOverride = require('method-override');
const flash = require('connect-flash')
const store = require('./utils/mongo-init');
const passport = require('passport')
const session = require('express-session') 
const {indexRouter} = require('./routes/indexRoute');
const { errorHandler, notFoundHandler,validationError } = require('./middelwares/error.middleware');
const path = require('path')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(methodOverride("_method"));

app.use(
  session({
    store: store,
    secret: "Shaikh1234",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter);

// app.use(validationError);
app.use(notFoundHandler);
app.use(errorHandler);

exports.app = app;