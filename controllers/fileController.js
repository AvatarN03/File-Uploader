const File = require("../models/File");
const User = require("../models/User");
const { uploadToS3, getPresignedUrl, deleteFromS3 } = require("../config/s3");
const { v4: uuidv4 } = require('uuid');

exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id, isDeleted: false });

    const fileWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await getPresignedUrl("getObject", file.s3Key, 3600);

        return {
          ...file.toObject(),
          url,
        };
      })
    );

    res.status(200).json({
      status: "success",
      data: {
        files: fileWithUrls,
        uploadRemaining: 15 - req.user.uploadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.initialUpload = async (req, res) => {
  try {
    // Make sure you have the multer middleware configured properly
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded"
      });
    }

    // These properties come from multer's file object
    const originalName = req.file.originalname; // Note: originalname (with 'n')
    const mimetype = req.file.mimetype;

    if (req.user.uploadCount >= 15) {
      return res.status(400).json({
        status: "error",
        message: "You have reached your upload limit",
      });
    }

    const fileKey = `user-uploads/user-${req.user._id}/${uuidv4()}-${originalName}`;
    const fileBuffer = req.file.buffer;

    const s3Result = await uploadToS3(fileBuffer, fileKey, mimetype);
  
    const newFile = await File.create({
      userId: req.user._id,
      s3Key: fileKey,
      originalName: originalName,
      mimeType: mimetype, // Changed from mimetype to mimeType for consistency
      size: req.file.size,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { uploadCount: 1 },
    });

    return res.status(201).json({
      status: "success",
      data: {
        file: newFile,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!file) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    await deleteFromS3(file.s3Key);
    await file.deleteOne(); // Remove the file from the database

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { uploadCount: -1 },
    });

    return res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getDownloadUrl = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    });

    if (!file) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }
    
    // Create params for download (with attachment disposition)
    const url = await getPresignedUrl("getObject", file.s3Key, 3600, {
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(file.originalName)}"` 
    });

    return res.status(200).json({
      status: "success",
      url: url,
      filename: file.originalName
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate download URL",
      error: error.message
    });
  }
};

exports.getPreviewUrl = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false
    });

    if (!file) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }
    
    // Get a simple presigned URL for viewing in browser (no attachment disposition)
    const url = await getPresignedUrl("getObject", file.s3Key, 3600);

    return res.status(200).json({
      status: "success",
      url: url,
      mimeType: file.mimeType
    });
  } catch (error) {
    console.error('Error generating preview URL:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate preview URL",
      error: error.message
    });
  }
};