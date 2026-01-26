const { body, validationResult } = require("express-validator");

const signUpValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    } else {
      return true;
    }
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = { signUpValidator };
