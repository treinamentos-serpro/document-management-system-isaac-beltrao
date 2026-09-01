const fs = require('node:fs/promises');

class DocumentsRepository {
  constructor() {
    this.documents = [];
  }

  create(document) {
    this.documents.push(document);
    return document;
  }

  findByOwner(owner) {
    return this.documents.filter((document) => document.owner === owner);
  }

  findByIdAndOwner(id, owner) {
    return this.documents.find((document) => document.id === id && document.owner === owner);
  }

  async readFile(document) {
    return fs.readFile(document.storagePath);
  }
}

module.exports = DocumentsRepository;