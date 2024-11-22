import {hashPassword} from "../utils/hashPassword.js";
import {generateToken} from "../utils/tokenUtils.js";
import connection from '../config/dbConnection.js';

export function authenticateUser(req, res, next) {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ?';
  let userId;
  connection.execute(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(400).send('User not found');
    }else{
      userId = results[0].id;
    }

    const user = results[0];
    const hashedPassword = hashPassword(password);

    if (hashedPassword === user.password) {
      req.user = user; 
      const token = generateToken(user);
      const query = 'UPDATE users SET token = ? WHERE id = ?';

      connection.execute(query, [token, userId], (err, result) => {
          if (err) {
          return res.status(500).json({ error: 'Database error' });
          }

          if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
          }

          return res.status(200).json({ message: 'Token generated and saved successfully', token });
      });
      req.token = token;
      req.userId = userId;
      return next();
    } else {
      return res.status(400).send('Invalid credentials');
    }
  });
}