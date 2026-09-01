import { useEffect, useState } from 'react';
import DocumentList from '../components/DocumentList.jsx';
import UploadComponent from '../components/UploadComponent.jsx';
import { listDocuments, uploadDocument } from '../services/documentService.js';

export default function DocumentsPage() {
  const [owner, setOwner] = useState('user-1');
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function loadDocuments() {
    if (!owner.trim()) {
      setDocuments([]);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      setDocuments(await listDocuments(owner.trim()));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [owner]);

  async function handleUpload(file) {
    await uploadDocument(file, owner.trim());
    await loadDocuments();
  }

  return (
    <main className="workspace">
      <header className="workspace__header">
        <div>
          <p className="eyebrow">Arquivo local</p>
          <h1>Document Management System</h1>
        </div>
        <label className="owner-field">
          <span>Usuário atual</span>
          <input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Ex.: user-1" />
        </label>
      </header>

      <section className="upload-section" aria-label="Enviar documento">
        <h2>Adicionar documento</h2>
        <UploadComponent owner={owner} onUpload={handleUpload} onError={setError} />
      </section>

      <section className="documents-section" aria-labelledby="documents-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Biblioteca</p>
            <h2 id="documents-title">Seus documentos</h2>
          </div>
          <button className="refresh-button" type="button" onClick={loadDocuments} disabled={isLoading || !owner.trim()} aria-label="Atualizar documentos">Atualizar</button>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        {isLoading ? <p className="loading-state">Carregando documentos...</p> : <DocumentList documents={documents} owner={owner.trim()} onError={setError} />}
      </section>
    </main>
  );
}