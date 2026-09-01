const { randomUUID } = require('node:crypto');

class DocumentsService {
  constructor(documentsRepository) {
    this.documentsRepository = documentsRepository;
  }

  createDocument(file, owner) {
    return this.documentsRepository.create({
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
    return this.documentsRepository.findByOwner(owner).map(this.toPublicMetadata);
  }

  async getDownload(id, owner) {
    const document = this.documentsRepository.findByIdAndOwner(id, owner);

    if (!document) {
      return null;
    }

    return {
      document,
      content: await this.documentsRepository.readFile(document),
    };
  }

  toPublicMetadata(document) {
    const { id, originalName, size, uploadedAt, owner } = document;
    return { id, originalName, size, uploadedAt, owner };
  }
}

module.exports = DocumentsService;