const express = require('express');
const ctrl = require('../controllers/blogController');
const { requireAuth } = require('../middleware/auth');
const { validateBody, validateQuery } = require('../utils/validate');
const { createBlogSchema, updateBlogSchema, listBlogsQuery } = require('../validators/blogSchemas');

const router = express.Router();

router.get('/', validateQuery(listBlogsQuery), ctrl.list);
router.get('/featured', ctrl.featured);
router.get('/trending', ctrl.trending);
router.get('/categories', ctrl.categories);
router.get('/slugs', ctrl.allSlugs);
router.get('/mine', requireAuth, ctrl.mine);
router.get('/mine/:id', requireAuth, ctrl.getMineById);
router.get('/:slug', ctrl.getBySlug);

router.post('/', requireAuth, validateBody(createBlogSchema), ctrl.create);
router.put('/:id', requireAuth, validateBody(updateBlogSchema), ctrl.update);
router.delete('/:id', requireAuth, ctrl.remove);

module.exports = router;
