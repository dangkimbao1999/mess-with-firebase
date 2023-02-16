import { body, validationResult, query } from 'express-validator';
import { getAuth } from "firebase/auth";

const userValidationRules = () => {
  return [
    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('phone').matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
    body('name').not().isEmpty().isString(),
    body('password').matches('.{8,}'),
  ]
}
const userLoginRules = () => {
  return [
    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password').matches('.{8,}'),
  ]
}

const historyRule = () => {
  return [
    query('type').matches(/\b(?:administrator|editor|contributor|user)\b/),
    query('title').isString(),
    query('amount').isNumeric()
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
const validateWithAuth = (req, res, next) => {
  const errors = validationResult(req);
  const auth = getAuth();
  const user = auth.currentUser;
  if (errors.isEmpty() && user) {
    return next()
  }
  if (!errors.isEmpty()){
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
  }
  if (!user) {
    return res.status(422).json({
      errors: "User is not authenticated",
    })
  }
}

export { validate, userValidationRules, validateWithAuth, userLoginRules, historyRule };