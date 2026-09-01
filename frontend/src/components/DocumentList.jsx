import DownloadButton from './DownloadButton.jsx';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents, owner, onError }) {
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
          <DownloadButton document={document} owner={owner} onError={onError} />
        </article>
      ))}
    </div>
  );
}