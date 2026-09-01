const { test } = require('node:test');
const assert = require('node:assert');
const DocumentsService = require('../src/services/documents.service');
const DocumentMetadataService = require('../src/services/document-metadata.service');

test('cria e lista documentos sem expor dados internos de armazenamento', () => {
  const storedDocuments = [];
  const documentsRepository = {
    create(document) {
      storedDocuments.push(document);
      return document;
    },
    findByOwner(owner) {
      return storedDocuments.filter((document) => document.owner === owner);
    },
  };
  const documentsService = new DocumentsService(documentsRepository, new DocumentMetadataService());

  const document = documentsService.createDocument({
    originalname: 'relatorio.txt',
    size: 20,
    filename: 'arquivo-interno.txt',
    path: '/storage/arquivo-interno.txt',
    mimetype: 'text/plain',
  }, 'user-1');

  assert.deepStrictEqual(documentsService.listDocuments('user-1'), [document]);
  assert.deepStrictEqual(Object.keys(document).sort(), [
    'id',
    'originalName',
    'owner',
    'size',
    'uploadedAt',
  ]);
  assert.strictEqual(storedDocuments[0].storagePath, '/storage/arquivo-interno.txt');
});