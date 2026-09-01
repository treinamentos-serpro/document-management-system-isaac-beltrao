import { useState } from 'react';
import { downloadDocument } from '../services/documentService.js';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents, owner, onError }) {
  const [downloadingId, setDownloadingId] = useState(null);

  async function handleDownload(document) {
    setDownloadingId(document.id);
    onError('');
    try {
      await downloadDocument(document.id, document.originalName, owner);
    } catch (error) {
      onError(error.message);
    } finally {
      setDownloadingId(null);
    }
  }

  if (documents.length === 0) {
    return <p className="empty-state">Nenhum documento disponível para este usuário.</p>;
  }

  return (
    <div className="document-list" role="list">
      {documents.map((document) => (
        <article className="document-row" key={document.id} role="listitem">
          <div className="document-row__icon" aria-hidden="true">DOC</div>
          <div className="document-row__details">
            <strong>{document.originalName}</strong>
            <span>{formatFileSize(document.size)} · {new Date(document.uploadedAt).toLocaleString('pt-BR')}</span>
          </div>
          <button
            className="download-button"
            type="button"
            aria-label={`Baixar ${document.originalName}`}
            disabled={downloadingId === document.id}
            onClick={() => handleDownload(document)}
          >
            {downloadingId === document.id ? '...' : 'Baixar'}
          </button>
        </article>
      ))}
    </div>
  );
}