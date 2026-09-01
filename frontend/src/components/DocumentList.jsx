import DownloadButton from './DownloadButton.jsx';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents, owner, onError }) {
  if (documents.length === 0) {
    return <p className="mt-5 border border-dashed border-moss/60 p-8 text-center text-sm text-moss">Nenhum documento disponível para este usuário.</p>;
  }

  return (
    <div className="mt-5 border-t border-moss/30" role="list">
      {documents.map((document) => (
        <article className="flex min-h-24 items-start gap-3 border-b border-moss/30 py-4 sm:items-center" key={document.id} role="listitem">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-sunflower text-[0.65rem] font-medium text-ink" aria-hidden="true">DOC</div>
          <div className="min-w-0 flex-1 space-y-1">
            <strong className="block truncate text-sm">{document.originalName}</strong>
            <span className="block text-xs text-moss">{formatFileSize(document.size)} · {new Date(document.uploadedAt).toLocaleString('pt-BR')}</span>
          </div>
          <DownloadButton document={document} owner={owner} onError={onError} />
        </article>
      ))}
    </div>
  );
}