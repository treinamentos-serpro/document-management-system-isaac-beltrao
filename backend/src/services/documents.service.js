class DocumentsService {
  constructor(documentsRepository, documentMetadataService) {
    this.documentsRepository = documentsRepository;
    this.documentMetadataService = documentMetadataService;
  }

  createDocument(file, owner) {
    const document = this.documentMetadataService.createFromFile(file, owner);
    return this.documentMetadataService.toPublicMetadata(this.documentsRepository.create(document));
  }

  listDocuments(owner) {
    return this.documentsRepository
      .findByOwner(owner)
      .map((document) => this.documentMetadataService.toPublicMetadata(document));
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

}

module.exports = DocumentsService;