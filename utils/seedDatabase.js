import connection from '../config/dbConnection.js';
import { hashPassword } from '../utils/hashPassword.js';

function seedUsers() {
  const password1 = hashPassword('password123');
  const password2 = hashPassword('password456');

  const seedQuery = `
    INSERT INTO users (email, password, name, mobile, address, image) VALUES 
    (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
  `;

  connection.execute(seedQuery, [
    'user1@example.com', password1, 'John Doe', '9876543210', '123 Main St', 'image1.jpg',
    'user2@example.com', password2, 'Jane Smith', '9123456789', '456 Oak St', 'image2.jpg',
  ], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
    } else {
      console.log('Users seeded successfully');
    }
  });
}
seedUsers()