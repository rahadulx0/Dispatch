const express = require('express');
const ctrl = require('../controllers/uploadController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/image', requireAuth, upload.single('image'), ctrl.single);
router.post('/images', requireAuth, upload.array('images', 10), ctrl.multiple);
router.delete('/:key', requireAuth, ctrl.remove);

module.exports = router;
