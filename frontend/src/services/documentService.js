const API_BASE_URL = '/api';

function getHeaders(owner) {
  return { 'X-User-Id': owner };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message || 'Não foi possível concluir a solicitação.');
  }

  return response;
}

export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request('/upload', {
    method: 'POST',
    headers: getHeaders(owner),
    body: formData,
  });

  return response.json();
}

export async function listDocuments(owner) {
  const response = await request('/documents', { headers: getHeaders(owner) });
  return response.json();
}

export async function downloadDocument(id, originalName, owner) {
  const response = await request(`/documents/${id}/download`, { headers: getHeaders(owner) });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = originalName;
  link.click();
  URL.revokeObjectURL(url);
}