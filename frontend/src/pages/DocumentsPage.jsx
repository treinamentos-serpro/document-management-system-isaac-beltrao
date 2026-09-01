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
    <main className="mx-auto w-[min(100%-2rem,1180px)] py-5 sm:py-8">
      <header className="border-b-2 border-ink pb-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-signal">Arquivo local / painel de documentos</p>
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">Document Management System</h1>
          </div>
          <label className="grid w-full gap-1.5 text-xs font-medium sm:max-w-[280px]">
            <span className="uppercase tracking-[0.1em] text-moss">Usuário atual</span>
            <input className="w-full border border-moss bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-moss/60 focus:border-ink focus:ring-2 focus:ring-sunflower" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Ex.: user-1" />
          </label>
        </div>
      </header>

      <div className="grid gap-8 py-7 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.5fr)] lg:gap-10">
        <section className="border-b border-moss/30 pb-7 lg:border-b-0 lg:border-r lg:pr-10" aria-label="Enviar documento">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-sunflower text-xs font-medium" aria-hidden="true">01</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-signal">Entrada</p>
              <h2 className="font-display text-2xl">Adicionar documento</h2>
            </div>
          </div>
          <UploadComponent owner={owner} onUpload={handleUpload} onError={setError} />
        </section>

        <section aria-labelledby="documents-title">
          <div className="flex flex-col gap-4 border-b border-moss/30 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-mist text-xs font-medium" aria-hidden="true">02</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-signal">Biblioteca</p>
                <h2 id="documents-title" className="font-display text-2xl">Seus documentos</h2>
              </div>
            </div>
            <button className="self-start border border-ink px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition hover:border-signal hover:bg-signal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:border-moss/40 disabled:text-moss disabled:opacity-100 sm:self-auto" type="button" onClick={loadDocuments} disabled={isLoading || !owner.trim()} aria-label="Atualizar documentos">Atualizar</button>
          </div>
          {error && <p className="mt-5 border-l-4 border-signal bg-[#f7dad1] px-4 py-3 text-sm leading-relaxed" role="alert">{error}</p>}
          {isLoading ? <p className="mt-5 border border-dashed border-moss/60 bg-white/40 p-8 text-center text-sm text-moss">Carregando documentos...</p> : <DocumentList documents={documents} owner={owner.trim()} onError={setError} />}
        </section>
      </div>
    </main>
  );
}