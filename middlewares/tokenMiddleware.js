import connection from '../config/dbConnection.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
export const checkTokenMiddleware = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  
  if (!tokenHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = tokenHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token malformed or missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;

    const query = 'SELECT * FROM users WHERE token = ?';
    connection.execute(query, [token], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (results.length > 0) {
        req.user = results[0];
        next();
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};