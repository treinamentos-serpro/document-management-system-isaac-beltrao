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
      className="rounded-sm border border-ink px-3 py-2 text-xs transition hover:border-signal hover:bg-signal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
      aria-label={`Baixar ${document.originalName}`}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? '...' : 'Baixar'}
    </button>
  );
}