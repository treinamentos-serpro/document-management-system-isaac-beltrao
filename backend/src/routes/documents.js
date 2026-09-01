// Rotas de documentos.
// Melhoria aplicada: separação de rotas em módulo próprio (SRP).

const express = require('express');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const documentController = require('../controllers/documentController');
const { STORAGE_DIR } = require('../config');

const router = express.Router();

// Limita operações de arquivo a 100 requisições por 15 minutos por IP
const fileRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições, aguarde antes de tentar novamente' },
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, STORAGE_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

// Limite de 10 MB por arquivo
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', fileRateLimit, upload.single('file'), documentController.upload);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', fileRateLimit, documentController.downloadDocument);

module.exports = router;
