const authenticate = require('../middlewares/authenticate'); //* token authentication
const validate = require('../middlewares/validate'); //* validate middlewares
const schemas = require('../validations/Users'); //* validations
const express = require('express');
const { create, index, login, projectList, resetPassword, update, updatePassword } = require('../controllers/Users');

const router = express.Router();

router.get('/', index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/").patch(authenticate, validate(schemas.updateValidation), update);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/projects").get(authenticate, projectList);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/change-password").patch(authenticate, validate(schemas.changePasswordValidation), updatePassword);

module.exports = router

