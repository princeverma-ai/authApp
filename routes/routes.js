const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.use(authController.protect);

router.route('/getusers').get(authController.getUsers);
router.route('/getuser/:id').get(authController.getUser);
router.route('/updateuser/:id').post(authController.updateUser);
router.route('/deleteuser/:id').delete(authController.deleteUser);

router.route('/getme').get(authController.getMe, authController.getUser)

module.exports = router;