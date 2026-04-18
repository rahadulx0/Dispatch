const express = require('express');
const ctrl = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/stats', ctrl.stats);

router.get('/users', ctrl.listUsers);
router.patch('/users/:id/role', ctrl.updateUserRole);
router.delete('/users/:id', ctrl.deleteUser);

router.get('/blogs', ctrl.listBlogs);
router.patch('/blogs/:id/status', ctrl.moderateBlog);
router.delete('/blogs/:id', ctrl.deleteBlog);

module.exports = router;
