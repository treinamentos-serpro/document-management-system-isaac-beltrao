class DocumentsController {
  constructor(documentsService) {
    this.documentsService = documentsService;
  }

  create = (req, res) => {
    const owner = this.getOwner(req, res);
    if (!owner) return;

    if (!req.file) {
      res.status(400).json({
        error: {
          code: 'FILE_REQUIRED',
          message: 'O campo file é obrigatório.',
        },
      });
      return;
    }

    const document = this.documentsService.createDocument(req.file, owner);
    res.status(201).json(this.documentsService.toPublicMetadata(document));
  };

  list = (req, res) => {
    const owner = this.getOwner(req, res);
    if (!owner) return;

    res.json(this.documentsService.listDocuments(owner));
  };

  download = async (req, res, next) => {
    const owner = this.getOwner(req, res);
    if (!owner) return;

    try {
      const download = await this.documentsService.getDownload(req.params.id, owner);

      if (!download) {
        res.status(404).json({
          error: {
            code: 'DOCUMENT_NOT_FOUND',
            message: 'Documento não encontrado.',
          },
        });
        return;
      }

      res.type(download.document.mimeType);
      res.attachment(download.document.originalName);
      res.send(download.content);
    } catch (error) {
      next(error);
    }
  };

  getOwner(req, res) {
    const owner = req.get('X-User-Id')?.trim();

    if (owner) return owner;

    res.status(400).json({
      error: {
        code: 'OWNER_REQUIRED',
        message: 'O cabeçalho X-User-Id é obrigatório.',
      },
    });
    return null;
  }
}

module.exports = DocumentsController;