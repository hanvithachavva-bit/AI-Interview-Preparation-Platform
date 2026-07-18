const User = require("../models/User");
const bcrypt = require("bcryptjs");
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const userResponse = {
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
};