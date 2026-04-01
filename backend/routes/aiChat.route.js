import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  createChat,
  getAllChats,
  getChatById,
  getUserChats,
  updateChat,
  deleteChat,
  getChatStats,
  getRecentChats
} from '../controllers/aiChat.controller.js';

const router = express.Router();

router.post('/', createChat);
router.get('/stats', getChatStats);
router.get('/recent', getRecentChats);
router.get('/my', isAuthenticated, getUserChats);
router.get('/all', isAuthenticated, getAllChats);
router.get('/:id', getChatById);
router.put('/:id', updateChat);
router.delete('/:id', isAuthenticated, deleteChat);

export default router;
