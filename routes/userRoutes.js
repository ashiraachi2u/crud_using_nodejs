import express from 'express';
import { authenticateUser } from '../middlewares/authenticateMiddleware.js';
import { checkTokenMiddleware } from '../middlewares/tokenMiddleware.js';
import {
  insertUser,
  getUserData,
  deleteUser,
  updateUser,
  loginUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/login', authenticateUser, loginUser);
router.post('/insert-users',checkTokenMiddleware, insertUser);
router.get('/show-users', checkTokenMiddleware, getUserData);
router.post('/delete-user', checkTokenMiddleware, deleteUser);
router.post('/update-user', checkTokenMiddleware, updateUser);

export default router;
