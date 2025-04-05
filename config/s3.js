const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * AWS S3 Utility Module
 * Provides functions for common S3 operations including upload, download, delete,
 * and generating presigned URLs for both GET and PUT operations.
 */

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - The file content as a buffer
 * @param {string} fileName - The key (file name) to use in S3
 * @param {string} contentType - The MIME type of the file
 * @param {Object} additionalParams - Optional additional parameters for S3 PutObject
 * @returns {Promise<Object>} - Returns object with the file key and ETag
 */
const uploadToS3 = async (fileBuffer, fileName, contentType, additionalParams = {}) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ...additionalParams
  };
  
  try {
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    return { 
      key: fileName,
      etag: result.ETag
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

/**
 * Download file from S3
 * @param {string} key - The key (file name) of the file in S3
 * @returns {Promise<Object>} - Returns object with file data and metadata
 */
const downloadFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };
  
  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    
    // Convert the readable stream to a buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    
    return {
      data: Buffer.concat(chunks),
      contentType: response.ContentType,
      metadata: response.Metadata
    };
  } catch (error) {
    console.error('Error downloading from S3:', error);
    throw error;
  }
};

/**
 * Delete file from S3
 * @param {string} key - The key (file name) of the file to delete
 * @returns {Promise<boolean>} - Returns true if deletion was successful
 */
const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };
  
  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};

/**
 * Generate a presigned URL for GET or PUT operations
 * @param {string} operation - 'getObject' or 'putObject'
 * @param {string} key - The key (file name) in S3
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @param {Object} additionalParams - Optional additional parameters
 * @returns {Promise<string>} - Returns the presigned URL
 */
const getPresignedUrl = async (operation, key, expiresIn = 3600, additionalParams = {}) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ...additionalParams
  };
  
  try {
    let command;
    
    switch (operation) {
      case 'getObject':
        command = new GetObjectCommand(params);
        break;
      case 'putObject':
        command = new PutObjectCommand(params);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
    
    const url = await getSignedUrl(s3Client, command, { 
      expiresIn: parseInt(expiresIn)
    });
    
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

/**
 * Check if a file exists in S3
 * @param {string} key - The key (file name) to check
 * @returns {Promise<boolean>} - Returns true if file exists
 */
const fileExists = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };
  
  try {
    const command = new GetObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return false;
    }
    console.error('Error checking if file exists:', error);
    throw error;
  }
};

module.exports = {
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  getPresignedUrl,
  fileExists
};