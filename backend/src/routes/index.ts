import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { updateProfile, getProfile } from '../controllers/profile.controller';
import { getLinks, createLink, updateLink, deleteLink, reorderLinks } from '../controllers/link.controller';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { simulatePaymentToggle } from '../controllers/subscription.controller';
import { getPublicStore } from '../controllers/public.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireProPlan, validateLinkLimit } from '../middlewares/planGuard.middleware';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, getMe);

// --- Profile Routes ---
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// --- Links Routes ---
router.get('/links', authMiddleware, getLinks);
router.post('/links', authMiddleware, validateLinkLimit, createLink);
router.put('/links/:id', authMiddleware, updateLink);
router.delete('/links/:id', authMiddleware, deleteLink);
router.patch('/links/reorder', authMiddleware, reorderLinks);

// --- Products Routes (Catalog - PRO Guarded) ---
router.get('/products', authMiddleware, requireProPlan, getProducts);
router.post('/products', authMiddleware, requireProPlan, createProduct);
router.put('/products/:id', authMiddleware, requireProPlan, updateProduct);
router.delete('/products/:id', authMiddleware, requireProPlan, deleteProduct);

// --- Subscription Simulation Routes ---
router.post('/subscription/simulate-toggle', authMiddleware, simulatePaymentToggle);

// --- Public Store Route ---
router.get('/public/:slug', getPublicStore);

export default router;
