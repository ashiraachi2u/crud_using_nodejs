import connection from '../config/dbConnection.js';
import { hashPassword } from '../utils/hashPassword.js';

export const loginUser = (req,res) =>{
    const token = req.token;
    const userId = req.userId;
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
}
export const getUserData = (req, res) => {
    const { searchValue } = req.body;
    let query;
    let queryParams = [];
  
    if (searchValue) {
      query = `
        SELECT id, name, email, mobile, address, image
        FROM users
        WHERE email LIKE ? OR mobile LIKE ? OR name LIKE ?`;
  
      const searchPattern = `%${searchValue}%`;
      queryParams = [searchPattern, searchPattern, searchPattern];
    } else {
      query = 'SELECT name, email, mobile, address, image FROM users';
    }
  
    connection.execute(query, queryParams, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
  
      if (result.length === 0) {
        const message = searchValue
          ? 'No users found matching the search criteria'
          : 'No users found';
        return res.status(404).json({ message });
      }
  
      return res.status(200).json({ users: result });
    });
};

export const updateUser = (req, res) => {
    const { userId, name, email, mobile, address, image } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!name && !email && !mobile && !address && !image) {
        return res.status(400).json({ error: 'At least one field is required to update' });
    }

    let updateFields = [];
    let updateValues = [];
    
    if (name) {
    updateFields.push('name = ?');
    updateValues.push(name);
    }
    if (email) {
    updateFields.push('email = ?');
    updateValues.push(email);
    }
    if (mobile) {
    updateFields.push('mobile = ?');
    updateValues.push(mobile);
    }
    if (address) {
    updateFields.push('address = ?');
    updateValues.push(address);
    }
    if (image) {
    updateFields.push('image = ?');
    updateValues.push(image);
    }

    updateValues.push(userId);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    connection.execute(query, updateValues, (err, result) => {
    if (err) {
        return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully' });
    });
}

export const deleteUser = (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    
    const query = 'DELETE FROM users WHERE id = ?';

    connection.execute(query, [userId], (err, result) => {
    if (err) {
        return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
    });
}

export const insertUser = (req, res) => {
    const { email, password, name, mobile, address, image } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email and password are required' });
    
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR mobile = ?';
    connection.execute(checkQuery, [email, mobile], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database error' });

        if (result.length > 0)
            return res.status(400).json({ error: 'Email or mobile number already in use' });

        const hashedPassword = hashPassword(password);
    
        const query = 'INSERT INTO users (email, password, name, mobile, address, image) VALUES (?, ?, ?, ?, ?, ?)';
        connection.execute(query, [email, hashedPassword, name, mobile, address, image], (err, result) => {
            if (err)
                return res.status(500).json({ error: 'Database error' });
        
            res.status(201).json({ message: 'User created successfully', userId: result.insertId });
        });
    })
}