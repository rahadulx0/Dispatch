const express = require('express');
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validateBody } = require('../utils/validate');
const { registerSchema, loginSchema, profileSchema } = require('../validators/authSchemas');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validateBody(registerSchema), ctrl.register);
router.post('/login', authLimiter, validateBody(loginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', requireAuth, ctrl.logout);
router.get('/me', requireAuth, ctrl.me);
router.patch('/me', requireAuth, validateBody(profileSchema), ctrl.updateProfile);

module.exports = router;
