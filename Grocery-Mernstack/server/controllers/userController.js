//Register :api/user/register
require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, //prevent javascript to acess cookie
      secure: true, //Use secure cookie in production
      sameSite: "none", //CRSF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });
    return res.json({
      success: true,
      message: "User Registered Successfully",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
}

//login user

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email or Password is missing",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ success: false, message: "User is not registered" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, //prevent javascript to acess cookie
      secure: true, //Use secure cookie in production
      sameSite: "none", //CRSF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });
    return res.json({
      success: true,
      message: "User Login Successfully",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
}

// Check Auth : api/user/is-auth

async function isAuth(req, res) {
  try {
    const userId = req.userId;
    console.log(userId)
    const user = await User.findOne({ _id: userId });
    return res.json({ success: true, user : user });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
}

//Logout : api/user/logout

async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //Use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CRSF protection
      
    });
    return res.json({success : true, message : "Logged out"})
  }
   catch (error) {
     res.json({ success: false, message: error.message });
    console.log(error);
  }
}

module.exports = { register, login, logout, isAuth };
