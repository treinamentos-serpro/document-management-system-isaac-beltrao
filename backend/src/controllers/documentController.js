// Controller de documentos: trata entrada/saída HTTP e validações básicas.
// Melhoria aplicada: SRP — apenas orquestra HTTP, delega lógica ao service.

const path = require('path');
const documentService = require('../services/documentService');
const { STORAGE_DIR } = require('../config');

function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const doc = documentService.saveDocument({
      file: req.file,
      owner: req.body.owner,
    });
    return res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

function listDocuments(req, res, next) {
  try {
    const docs = documentService.listDocuments();
    return res.json(docs);
  } catch (err) {
    next(err);
  }
}

function downloadDocument(req, res, next) {
  try {
    const doc = documentService.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }
    // Garante que o caminho final está dentro do STORAGE_DIR (defesa em profundidade)
    const safePath = path.join(STORAGE_DIR, path.basename(doc.storagePath));
    res.download(safePath, doc.originalName);
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, listDocuments, downloadDocument };
