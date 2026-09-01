const { randomUUID } = require('node:crypto');

class DocumentMetadataService {
  createFromFile(file, owner) {
    return {
      id: randomUUID(),
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      owner,
      storedName: file.filename,
      storagePath: file.path,
      mimeType: file.mimetype,
    };
  }

  toPublicMetadata(document) {
    const { id, originalName, size, uploadedAt, owner } = document;
    return { id, originalName, size, uploadedAt, owner };
  }
}

module.exports = DocumentMetadataService;