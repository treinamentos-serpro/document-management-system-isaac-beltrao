import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const doc = await uploadDocument(file, owner);
      onUploadSuccess(doc);
      setFile(null);
      setOwner('');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section>
      <h2>Enviar documento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Arquivo:</label>{' '}
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label htmlFor="owner">Dono (opcional):</label>{' '}
          <input
            id="owner"
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="seu nome"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={uploading || !file}>
          {uploading ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
    </section>
  );
}
