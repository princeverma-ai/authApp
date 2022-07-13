const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');


const Router = express.Router();

Router.use(authController.isLoggedIn)

Router.route('/').get(authController.protect, viewController.homeView);

Router.route('/login').get(viewController.loginView);
module.exports = Router;