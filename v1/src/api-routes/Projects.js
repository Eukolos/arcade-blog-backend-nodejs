const authenticate = require('../middlewares/authenticate'); //* token authentication
const validate = require('../middlewares/validate'); //* validate middlewares
const schemas = require('../validations/Projects'); //* validations
const express = require('express');
const { index, create, update } = require('../controllers/Projects');
const router = express.Router();

router.route("/").get(authenticate, index);
router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update);

module.exports = router
 
