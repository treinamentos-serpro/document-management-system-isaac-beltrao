import { useState } from 'react';
import { downloadDocument } from '../services/documentService.js';

export default function DownloadButton({ document, owner, onError }) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    onError('');
    try {
      await downloadDocument(document.id, document.originalName, owner);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button
      className="shrink-0 border border-ink px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] transition hover:border-signal hover:bg-signal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:border-moss/40 disabled:text-moss disabled:opacity-100"
      type="button"
      aria-label={`Baixar ${document.originalName}`}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? '...' : 'Baixar'}
    </button>
  );
}