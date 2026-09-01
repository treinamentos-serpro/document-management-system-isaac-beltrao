import { getDownloadUrl } from '../services/documentService';

export default function DownloadButton({ id, name }) {
  return (
    <a href={getDownloadUrl(id)} download={name}>
      Baixar
    </a>
  );
}
