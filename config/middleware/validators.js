import { body, param, validationResult } from "express-validator";

const signUpValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username can only contain letters +/ numbers"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmPass").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    } else {
      return true;
    }
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array });
    } else {
      next();
    }
  },
];

module.exports = validateSignUp;
