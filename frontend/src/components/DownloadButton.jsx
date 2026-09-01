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
      className="download-button"
      type="button"
      aria-label={`Baixar ${document.originalName}`}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? '...' : 'Baixar'}
    </button>
  );
}