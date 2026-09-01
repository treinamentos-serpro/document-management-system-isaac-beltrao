const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const multer = require('multer');
const DocumentsRepository = require('../repositories/documents.repository');
const DocumentsService = require('../services/documents.service');
const DocumentsController = require('../controllers/documents.controller');

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

const documentsRepository = new DocumentsRepository();
const documentsService = new DocumentsService(documentsRepository);
const documentsController = new DocumentsController(documentsService);
const router = express.Router();

router.post('/upload', upload.single('file'), documentsController.create);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;