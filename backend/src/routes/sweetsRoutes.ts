import express from 'express';
import {
    addSweet, getAllSweets, searchSweets, updateSweet, deleteSweet,
    purchaseSweet, restockSweet, checkoutCart
} from '../controllers/sweetsController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public/Protected Read Routes (Requirement says Protected)
router.get('/', verifyToken, getAllSweets);
router.get('/search', verifyToken, searchSweets);

// Admin Write Routes
router.post('/', [verifyToken, isAdmin], addSweet);
router.put('/:id', [verifyToken, isAdmin], updateSweet);
router.delete('/:id', [verifyToken, isAdmin], deleteSweet);

// Inventory Routes
router.post('/:id/purchase', verifyToken, purchaseSweet);
router.post('/:id/restock', [verifyToken, isAdmin], restockSweet);

// Cart Checkout
router.post('/checkout', verifyToken, checkoutCart);

export default router;
