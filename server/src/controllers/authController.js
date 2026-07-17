const User = require("../models/User");

const register = async (req, res) => {
  try {
    console.log("NEW CONTROLLER IS RUNNING");
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const newUser = await User.create({
      fullName,
      email,
      password,
    });
    console.log(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
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