// Handles signing up and logging in — passwords get hashed automatically, and a token is returned on success

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Creates a signed JWT token containing the user's id and role
// Token expires after 7 days — after that the user must log in again
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/users/register — Create a new user account
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Prevent duplicate accounts with the same email
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Only 'user' and 'host' can be self-selected at signup — 'admin' must be granted manually in the database
  const safeRole = role === 'host' ? 'host' : 'user';

  // Password is hashed inside the User model before saving to MongoDB
  const user = await User.create({ username, email, password, role: safeRole });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

// POST /api/users/login — Log in with email and password
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const user = await User.findOne({ email });

  // matchPassword uses bcrypt.compare to check the plain text against the hash
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

module.exports = { registerUser, loginUser };
