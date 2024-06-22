const connectToDB = require("../utils/db");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const signupUser = async (req, res) => {
  await connectToDB();
  const { email, firstName, lastName, image, password, username } = req.body;
  console.log(image);
  if (!username) {
    throw new Error("Missing field Username");
  }
  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password) {
    throw new Error("Missing field Password");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    firstName,
    username,
    lastName,
    image: image.array[0],
    password: hashedPassword,
  });

  const result = await user.save();

  res.status(200).json({ message: "USERSIGNEDUP", user: result });
};

const loginUser = async (req, res) => {
  await connectToDB();
  const { email, password } = req.body;
  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password) {
    throw new Error("Missing field Password");
  }

  const user = await User.findOne({ email: email });

  if (!user) throw new Error("User does not exist");

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) throw new Error("Password's do not match");

  const token = generateToken(user);
  res
      .status(201)
      .cookie("admin", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "USERLOGGED",
        user: user,
        token: token,
      });
};

const fetchUser = async (req, res) => {
  await connectToDB();
  const {userId} = req.params;
  const user = await User.findById(userId);

  res.status(201).json({user: user});
}

module.exports = { signupUser, loginUser, fetchUser };
