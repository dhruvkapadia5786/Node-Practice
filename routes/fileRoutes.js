const express = require('express');
const fileController = require('../controllers/fileController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Single file upload
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Multiple file upload
router.post('/upload-multiple', upload.array('files', 5), fileController.uploadFiles);

module.exports = router;