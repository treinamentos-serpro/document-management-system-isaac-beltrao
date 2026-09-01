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
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="dropzone" htmlFor="document-file">
        <span className="dropzone__symbol" aria-hidden="true">+</span>
        <span>Escolha um documento</span>
        <small>Qualquer formato, até 100 MB</small>
        <input ref={inputRef} id="document-file" type="file" onChange={selectFile} />
      </label>
      <div className="upload-form__actions">
        <span className="file-name">{selectedFile?.name || 'Nenhum arquivo selecionado'}</span>
        <button type="submit" disabled={!owner.trim() || isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </div>
    </form>
  );
}