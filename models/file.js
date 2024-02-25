const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: String,
    fileKey: String,
    fileType: String,
    fileSize: Number,
    fileUrl: String,
});

const File = mongoose.model('File', fileSchema);

module.exports = File;