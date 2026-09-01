import { useRef, useState } from 'react';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function UploadComponent({ owner, onUpload, onError }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  function selectFile(event) {
    const [file] = event.target.files;
    setSelectedFile(file || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      onError('Selecione um arquivo para enviar.');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      onError('O arquivo excede o limite de 100 MB.');
      return;
    }

    setIsUploading(true);
    onError('');
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      inputRef.current.value = '';
    } catch (error) {
      onError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-moss bg-mist p-6 text-center transition hover:bg-[#d0e0d3] focus-within:ring-2 focus-within:ring-sunflower" htmlFor="document-file">
        <span className="font-display text-4xl leading-none text-signal" aria-hidden="true">+</span>
        <span>Escolha um documento</span>
        <small className="text-xs text-moss">Qualquer formato, até 100 MB</small>
        <input className="sr-only" ref={inputRef} id="document-file" type="file" onChange={selectFile} />
      </label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-moss">{selectedFile?.name || 'Nenhum arquivo selecionado'}</span>
        <button className="rounded-sm border border-ink bg-ink px-4 py-2.5 text-sm text-white transition hover:border-signal hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!owner.trim() || isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </div>
    </form>
  );
}