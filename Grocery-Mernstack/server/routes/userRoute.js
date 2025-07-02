const express = require("express");
const {register,login,isAuth,logout}  = require("../controllers/userController");
const authUser = require("../middlewares/authUser") //user middlewware
const authSeller = require("../middlewares/authSeller")
const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.post("/login",login)
userRouter.get("/is-auth",authUser,isAuth)
userRouter.get("/logout",authUser,logout)

module.exports = userRouter