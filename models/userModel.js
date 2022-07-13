const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "a name is reqiuired"]
    },
    email: {
        type: String,
        require: [true, "an email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter password"],
        select: false
    },
    passwordChangeTime: Date,
    photo: String,
    bio: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next();
})

userSchema.methods.checkPassword = async function (canidatePassword, userPassword) {
    return await bcrypt.compare(canidatePassword, userPassword);
}

userSchema.methods.passwordChanged = function (jwtTimeStamp) {
    if (this.passwordChangeTime) {
        const changedTimeStamp = this.passwordChangeTime.getTime() / 1000;
        return jwtTimeStamp < changedTimeStamp;
    }
    return false;
}

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;