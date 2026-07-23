// Checks that the user is logged in before letting them hit protected routes
// It reads the JWT token from the request header and blocks anyone without a valid one

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Check if a token was sent in the request header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // Pull the token out from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token is valid and not tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request so routes can use it
    req.user = decoded;

    // Move on to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Restricts a route to specific roles — must run after protect() so req.user is set
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized for this action' });
  }
  next();
};

module.exports = { protect, requireRole };
