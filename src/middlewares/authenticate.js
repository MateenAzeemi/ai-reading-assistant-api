// import jwt from 'jsonwebtoken';

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   const token = authHeader.split(' ')[1];

//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }

//     req.user = user;
//     next();
//   });
// };

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
  console.log("USER TOKEN", token)
  if (!token) {
    console.log('Access token is missing');
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Extract userId from the decoded token payload
    const userId = decoded.userId; // Use `userId` instead of `sub`

    if (!userId) {
      return res.status(403).json({ message: 'Invalid token: Missing user ID' });
    }

    // Attach the user ID to the request object
    req.user = { userId };
    console.log('User authenticated:', req.user);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log('Invalid or expired token:', error);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired', error: error.message });
    }

    // Handle other JWT errors (e.g., invalid token)
    return res.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export default authenticate;