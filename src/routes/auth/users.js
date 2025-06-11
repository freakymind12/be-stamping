const express = require("express");
const { check } = require("express-validator");
const usersController = require("../../controllers/auth/users")
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("username", "Please enter a username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  usersController.createUser
);

router.patch("/change-password", [
  check(
    "old_password",
    "Please enter your old password"
  ).isLength({ min: 6 }),
  check(
    "new_password",
    "Please enter your new password with min length 6 character"
  ).isLength({ min: 6 }),
], authMiddleware.authenticateToken, usersController.changePassword);

router.patch("/:id", authMiddleware.authenticateToken, usersController.updateUser)

router.delete("/:id", authMiddleware.authenticateToken, usersController.deleteUser)

router.get("/", authMiddleware.authenticateToken, usersController.getUser)

module.exports = router;
