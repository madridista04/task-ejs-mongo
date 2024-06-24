const Router = require('express');
const { validate } = require('express-validation');
const { getUserWithId,
        addUser, 
        updateUser, 
        deleteUser, 
        getAllUsers, 
        loginUser,
        logout,
        addUserProcess,
    } = require('../controllers/user.controller');
const { 
    addUserValidation,
    getUserWithIdValidation,
    deleteUserValidation,
    updateUserValidation,
    getUsersValidation,
} = require('../validations/user.validation');
const { authorization, isAuthenticated, checkLogIn } = require('../middelwares/auth.middleware');
const passport = require('passport');

const userRoute = Router();

userRoute.get('/', 
            validate(getUsersValidation, {}, { allowUnknown: false, abortEarly: true }),
            isAuthenticated,
            authorization(['user','admin']), 
            getAllUsers);

userRoute.get('/login',checkLogIn,loginUser);

userRoute.post('/login',
            passport.authenticate('local', 
                {session:true, 
                successRedirect:'/feed',
                failureFlash:"Enter proper credentials"})
            );

userRoute.get('/logout', logout)


userRoute.get('/register',addUser);
userRoute.post('/register', validate(addUserValidation),addUserProcess);

userRoute.get('/:userId',
            validate(getUserWithIdValidation),
            isAuthenticated,
            authorization(['user','admin']), 
            getUserWithId);

userRoute.put('/:userId',
            validate(updateUserValidation),
            isAuthenticated,
            authorization(['user']), 
            updateUser);
            
userRoute.delete('/:userId',
            validate(deleteUserValidation),
            isAuthenticated,
            authorization(['user','admin']), 
            deleteUser);

exports.userRoute = userRoute;