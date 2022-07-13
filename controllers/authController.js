const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');

const secret = 'my-ultra-secret-key-hahaha';

const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
}
const signToken = id => {
    return jwt.sign({ id }, secret, { expiresIn: '5d' });
}

exports.signup = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);

        const token = signToken(user._id);

        if (process.env.NODE_ENV == 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions)

        user.password = undefined;

        res.status(200).json({
            status: "Succesful",
            tokenData: token,
            userData: user
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(500).json({
                status: "fail",
                message: "please provide email or password"
            })
        }

        const user = await UserModel.findOne({ email }).select('+password');


        if (!user || !(await user.checkPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password"
            });
        }

        const token = signToken(user._id);
        if (process.env.NODE_ENV == 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions)
        res.status(200).json({
            status: "Succesful",
            tokenData: token,
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie('jwt', 'logedOut', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        res.status(200).json({
            message: "success"
        })
    }
    catch (error) {
        res.status(400).json({ error })
    }
}

exports.getUsers = async (req, res) => {
    try {

        const users = await UserModel.find();
        res.status(200).json({ users });

    } catch (error) {
        res.status(400).json({ error });
    }
}


exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }
        if (!token) {
            return res.status(401).end('please log in');
        }
        const decoded = await util.promisify(jwt.verify)(token, secret);

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).end("user is deleted");
        }

        if (user.passwordChanged(decoded.iat)) {
            return res.status(401).end("user changed password");
        };
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json(error);

    }
}

exports.isLoggedIn = async (req, res, next) => {
    try {

        if (req.cookies.jwt) {
            const decoded = await util.promisify(jwt.verify)(req.cookies.jwt, secret);

            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return next()
            }

            if (user.passwordChanged(decoded.iat)) {
                return next();
            };
            res.locals.user = user;
            return next();
        }
        return next();

    } catch (error) {
        return next();

    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).end("user not found");

        res.status(200).json({
            user: user
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            error: error
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        });
        if (!user) return res.status(404).end("user not found");
        res.status(200).json({
            User: user
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            error: error
        });
    }
}
exports.deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(204).end("deleted")
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            error: error
        });
    }
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
}