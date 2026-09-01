import { useState, useEffect, useCallback } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/documentService';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  function handleUploadSuccess(doc) {
    setDocuments((prev) => [doc, ...prev]);
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploadSuccess={handleUploadSuccess} />
      <hr style={{ margin: '1.5rem 0' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Carregando documentos…</p> : <DocumentList documents={documents} />}
    </main>
  );
}

