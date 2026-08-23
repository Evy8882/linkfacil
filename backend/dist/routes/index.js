"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const profile_controller_1 = require("../controllers/profile.controller");
const link_controller_1 = require("../controllers/link.controller");
const product_controller_1 = require("../controllers/product.controller");
const subscription_controller_1 = require("../controllers/subscription.controller");
const public_controller_1 = require("../controllers/public.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const planGuard_middleware_1 = require("../middlewares/planGuard.middleware");
const router = (0, express_1.Router)();
// --- Auth Routes ---
router.post('/auth/register', auth_controller_1.register);
router.post('/auth/login', auth_controller_1.login);
router.get('/auth/me', auth_middleware_1.authMiddleware, auth_controller_1.getMe);
// --- Profile Routes ---
router.get('/profile', auth_middleware_1.authMiddleware, profile_controller_1.getProfile);
router.put('/profile', auth_middleware_1.authMiddleware, profile_controller_1.updateProfile);
// --- Links Routes ---
router.get('/links', auth_middleware_1.authMiddleware, link_controller_1.getLinks);
router.post('/links', auth_middleware_1.authMiddleware, planGuard_middleware_1.validateLinkLimit, link_controller_1.createLink);
router.put('/links/:id', auth_middleware_1.authMiddleware, link_controller_1.updateLink);
router.delete('/links/:id', auth_middleware_1.authMiddleware, link_controller_1.deleteLink);
router.patch('/links/reorder', auth_middleware_1.authMiddleware, link_controller_1.reorderLinks);
// --- Products Routes (Catalog - PRO Guarded) ---
router.get('/products', auth_middleware_1.authMiddleware, planGuard_middleware_1.requireProPlan, product_controller_1.getProducts);
router.post('/products', auth_middleware_1.authMiddleware, planGuard_middleware_1.requireProPlan, product_controller_1.createProduct);
router.put('/products/:id', auth_middleware_1.authMiddleware, planGuard_middleware_1.requireProPlan, product_controller_1.updateProduct);
router.delete('/products/:id', auth_middleware_1.authMiddleware, planGuard_middleware_1.requireProPlan, product_controller_1.deleteProduct);
// --- Subscription Simulation Routes ---
router.post('/subscription/simulate-toggle', auth_middleware_1.authMiddleware, subscription_controller_1.simulatePaymentToggle);
// --- Public Store Route ---
router.get('/public/:slug', public_controller_1.getPublicStore);
exports.default = router;
