const express = require("express");
const multer = require("multer");
const authController = require("../controllers/authController.js")
const fileController = require("../controllers/fileController.js")

const router = express.Router();
const upload = multer();

router.use(authController.protect)

// Get all user files
router.get('/', fileController.getUserFiles);

// Upload a new file
router.post('/upload', upload.single('file'), fileController.initialUpload);

// Delete a file
router.delete('/:id', fileController.deleteFile);

// Get download URL for a file
router.get('/:id/download', fileController.getDownloadUrl);

// Get preview URL for a file
router.get('/:id/preview', fileController.getPreviewUrl);

module.exports = router;