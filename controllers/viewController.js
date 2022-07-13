const User = require('../models/userModel');

exports.homeView = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).render('home', {
            title: "Home",
            users: allUsers
        });
    } catch (error) {

        res.status(400).json(error)
    }
}

exports.loginView = async (req, res) => {
    try {

        res.status(200).render('login', {
            title: "LogIn",
            "message": "loggedIn"
        });
    } catch (error) {

        res.status(400).json(error)
    }
}