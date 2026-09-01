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
    <main className="mx-auto w-[min(100%-2rem,1060px)] py-9 sm:py-14">
      <header className="flex flex-col gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-signal">Arquivo local</p>
          <h1 className="font-display text-4xl leading-none sm:text-5xl">Document Management System</h1>
        </div>
        <label className="grid w-full max-w-[250px] gap-2 text-xs md:w-[250px]">
          <span>Usuário atual</span>
          <input className="w-full rounded-sm border border-moss bg-white px-3 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-sunflower" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Ex.: user-1" />
        </label>
      </header>

      <section className="border-b border-moss/30 py-10" aria-label="Enviar documento">
        <h2 className="mb-5 font-display text-2xl">Adicionar documento</h2>
        <UploadComponent owner={owner} onUpload={handleUpload} onError={setError} />
      </section>

      <section className="py-10" aria-labelledby="documents-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-signal">Biblioteca</p>
            <h2 id="documents-title" className="font-display text-2xl">Seus documentos</h2>
          </div>
          <button className="self-start rounded-sm border border-ink px-4 py-2 text-sm transition hover:border-signal hover:bg-signal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto" type="button" onClick={loadDocuments} disabled={isLoading || !owner.trim()} aria-label="Atualizar documentos">Atualizar</button>
        </div>
        {error && <p className="mt-5 border-l-4 border-signal bg-[#f7dad1] px-4 py-3 text-sm" role="alert">{error}</p>}
        {isLoading ? <p className="mt-5 border border-dashed border-moss/60 p-8 text-center text-sm text-moss">Carregando documentos...</p> : <DocumentList documents={documents} owner={owner.trim()} onError={setError} />}
      </section>
    </main>
  );
}