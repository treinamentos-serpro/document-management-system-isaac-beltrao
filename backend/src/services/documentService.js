// Serviço de documentos: contém as regras de negócio.
// Melhorias aplicadas:
//   - SRP: só lida com regras de negócio, delega persistência ao repository
//   - Proteção contra path traversal: sanitiza o nome do arquivo antes de salvar

const path = require('path');
const fs = require('fs');
const documentRepository = require('../repositories/documentRepository');
const { STORAGE_DIR } = require('../config');

// Garante que o diretório de armazenamento existe
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

/**
 * Remove caracteres perigosos do nome do arquivo para evitar path traversal.
 * - base: mantém apenas letras, números, underscore e hífen
 * - ext: mantém apenas letras e números (sem ponto extra dentro da extensão)
 */
function sanitizeFileName(name) {
  const rawExt = path.extname(name);
  const ext = rawExt ? '.' + rawExt.slice(1).replace(/[^a-zA-Z0-9]/g, '') : '';
  const base = path.basename(name, rawExt).replace(/[^a-zA-Z0-9_\-]/g, '_');
  return `${base}${ext}`;
}

function saveDocument({ file, owner }) {
  const sanitizedName = sanitizeFileName(file.originalname);
  const doc = documentRepository.save({
    originalName: file.originalname,
    sanitizedName,
    size: file.size,
    owner: owner || 'anonymous',
    storagePath: file.path,
  });
  return doc;
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocumentById(id) {
  const doc = documentRepository.findById(id);
  if (!doc) return null;

  // Valida que o caminho do arquivo está dentro do diretório de storage
  const resolvedPath = path.resolve(doc.storagePath);
  if (!resolvedPath.startsWith(STORAGE_DIR + path.sep) && resolvedPath !== STORAGE_DIR) {
    throw new Error('Caminho de arquivo inválido');
  }

  return doc;
}

module.exports = { saveDocument, listDocuments, getDocumentById };
