const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true,
        minlength: [3,"username too samll"],
        maxlength: [15, "username too big"]
    },
    email : {
        type: String,
        required: true,
        // unique: true
    },
    phone : {
        type: String,
        required: true,
        // unique: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        // required: true
    },
    role:{
        type: String,
        default: 'user',
    },
    isDelete: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.checkPassword = function(password) {
    // console.log(password);
    return bcrypt.compare(password,this.password);
};


module.exports = mongoose.model('userModel',userSchema);