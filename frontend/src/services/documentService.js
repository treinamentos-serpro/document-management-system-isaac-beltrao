// Serviço de comunicação com a API do backend.
// Toda comunicação passa pelo prefixo /api (proxy Vite).

const BASE = '/api';

export async function uploadDocument(file, owner = '') {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) formData.append('owner', owner);

  const response = await fetch(`${BASE}/upload`, { method: 'POST', body: formData });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao enviar arquivo');
  }
  return response.json();
}

export async function listDocuments() {
  const response = await fetch(`${BASE}/documents`);
  if (!response.ok) throw new Error('Erro ao listar documentos');
  return response.json();
}

export function getDownloadUrl(id) {
  return `${BASE}/documents/${id}/download`;
}
