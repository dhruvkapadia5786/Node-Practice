const File = require('../models/file');
const s3 = require('../utils/s3');

class FileService {
    async uploadFiles(files) {
        try {
            const uploadedFiles = [];

            for (const file of files) {
                const uploadedFile = await this.uploadFile(file);
                uploadedFiles.push(uploadedFile);
            }

            return uploadedFiles;
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            // Extract relevant information from the uploaded file
            const { originalname, buffer, mimetype, size } = file;

            // Define allowed file types
            const allowedFileTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/bmp',
                'image/tiff',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'application/zip',
                'application/x-rar-compressed',
                'application/x-tar',
                'application/x-gzip',
                'application/x-7z-compressed',
                'application/vnd.rar',
                'application/x-msdownload', // Executables
                'audio/mpeg',
                'audio/x-wav',
                'video/mp4',
                'video/mpeg',
                'video/quicktime',
                'application/x-shockwave-flash', // Flash files
                'application/octet-stream', // Binary files
            ];

            // Check if the file type is allowed
            if (!allowedFileTypes.includes(mimetype)) {
                throw new Error('Unsupported file type');
            }

            // Define maximum allowed file size in bytes (e.g., 50MB)
            const maxFileSize = 50 * 1024 * 1024; // 50MB

            // Check if the file size exceeds the maximum allowed size
            if (size > maxFileSize) {
                throw new Error('File size exceeds the maximum allowed size');
            }

            // Generate a unique key for the file in S3
            const fileKey = `${Date.now()}_${originalname}`;

            // Set up parameters for S3 upload
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileKey,
                Body: buffer,
                ContentType: mimetype,
            };

            // Upload the file to S3
            const s3UploadResponse = await s3.upload(params).promise();

            // Create a new File document to store in MongoDB
            const newFile = new File({
                fileName: originalname,
                fileKey,
                fileType: mimetype,
                fileSize: size,
                fileUrl: s3UploadResponse.Location,
            });

            // Save the file details to MongoDB
            const savedFile = await newFile.save();

            return savedFile;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}

module.exports = new FileService();
