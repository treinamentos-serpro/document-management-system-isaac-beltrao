// Repositório de documentos: armazena metadados em memória e arquivos em disco.
// Melhoria aplicada: responsabilidade única (SRP) — só cuida de persistência.

const { randomUUID } = require('crypto');

// Armazenamento em memória dos metadados dos documentos
const documents = new Map();

function save({ originalName, sanitizedName, size, owner, storagePath }) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const doc = { id, originalName, sanitizedName, size, owner, storagePath, createdAt };
  documents.set(id, doc);
  return doc;
}

function findAll() {
  return Array.from(documents.values());
}

function findById(id) {
  return documents.get(id) || null;
}

module.exports = { save, findAll, findById };
