const { randomUUID } = require('node:crypto');

class DocumentService {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  createDocument(file, owner) {
    return this.documentRepository.create({
      id: randomUUID(),
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      owner,
      storedName: file.filename,
      storagePath: file.path,
      mimeType: file.mimetype,
    });
  }

  listDocuments(owner) {
    return this.documentRepository.findByOwner(owner).map(this.toPublicMetadata);
  }

  async getDownload(id, owner) {
    const document = this.documentRepository.findByIdAndOwner(id, owner);

    if (!document) {
      return null;
    }

    return {
      document,
      content: await this.documentRepository.readFile(document),
    };
  }

  toPublicMetadata(document) {
    const { id, originalName, size, uploadedAt, owner } = document;
    return { id, originalName, size, uploadedAt, owner };
  }
}

module.exports = DocumentService;