const fileService = require('../services/fileService');
const upload = require('../middleware/uploadMiddleware');

class FileController {
    async uploadFile(req, res) {
        try {
            const file = req.file;
            const result = await fileService.uploadFile(file);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async uploadFiles(req, res) {
        try {
            const files = req.files;
            const result = await fileService.uploadFiles(files);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new FileController();