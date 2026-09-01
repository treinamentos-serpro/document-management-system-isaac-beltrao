const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const multer = require('multer');
const DocumentRepository = require('../repositories/documentRepository');
const DocumentService = require('../services/documentService');
const DocumentController = require('../controllers/documentController');

const storagePath = process.env.STORAGE_PATH || path.resolve(__dirname, '../../storage');
fs.mkdirSync(storagePath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: storagePath,
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);
const router = express.Router();

router.post('/upload', upload.single('file'), documentController.create);
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;