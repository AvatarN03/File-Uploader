const jwt = require("jsonwebtoken");

const User = require("../models/User");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        uploadCount: newUser.uploadCount,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: {
        id: user._id,
        email: user.email,
        uploadsRemaining: user.uploadCount,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "helloo"});
  }
};

exports.protect = async (req, res, next) => {

  try {

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const currentUser = await User.findById(decoded.id).select("-password");
    
    if (!currentUser)
      return res.status(401).json({ message: "User no longer exists" });
    
    req.user = currentUser;
    return next();
    
    
    
  } catch (error) {

    res.status(401).json({ message: "Unauthorized" });
  }
};


exports.check = async (req, res) => {

  try {

    return res.status(200).json({
      status: "success",
      data: {
        message: "User authenticated successfully",
        user: req.user,
      }
    })
    
    
    
  } catch (error) {

    res.status(401).json({ message: "Unauthorized" });
  }
};
