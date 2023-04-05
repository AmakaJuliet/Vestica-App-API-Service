const authRouter = require("express").Router();
const { createUser, login } = require("../controllers/authController");

authRouter.post("/signup", createUser);
authRouter.post("/login", login);

module.exports = authRouter;