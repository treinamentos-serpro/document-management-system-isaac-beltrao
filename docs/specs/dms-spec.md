# Especificação - Document Management System

## 1. Objetivo

Permitir que usuários enviem, consultem e baixem seus documentos com armazenamento exclusivamente local.

## 2. Escopo

### Dentro do escopo

- Upload de um arquivo multipart no campo `file`.
- Listagem de documentos do usuário identificado pelo cabeçalho `X-User-Id`.
- Download de documento pertencente ao usuário solicitante.
- Armazenamento de arquivos em `backend/storage` usando `multer` com `diskStorage`.
- Metadados mantidos somente em memória enquanto o processo estiver ativo.

### Fora do escopo

- Armazenamento externo, em nuvem ou banco de dados persistente.
- Versionamento, edição, remoção, busca e compartilhamento de documentos.
- Autenticação completa com sessão ou token.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O usuário pode enviar qualquer tipo de arquivo de até 100 MB pelo campo `file`. |
| RF-02 | Toda operação exige o cabeçalho não vazio `X-User-Id`, que define o proprietário. |
| RF-03 | O sistema gera um UUID v4, persiste o arquivo localmente e mantém seus metadados em memória. |
| RF-04 | O usuário pode listar exclusivamente seus próprios documentos. |
| RF-05 | O usuário pode baixar um documento próprio pelo identificador. Documentos ausentes ou de outro proprietário retornam `404`. |
| RF-06 | Arquivos com o mesmo nome original são aceitos, sem sobrescrita no armazenamento. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | O upload usa Multer `diskStorage`, limitado a 100 MB, e grava apenas no filesystem local. |
| RNF-02 | `PORT` e `STORAGE_PATH` são configuráveis por ambiente; os valores padrão são `3000` e `backend/storage`. |
| RNF-03 | Erros retornam o envelope `{ "error": { "code": string, "message": string } }`. |
| RNF-04 | Falhas de leitura/escrita e limites de upload são tratadas nos limites HTTP. |
| RNF-05 | A arquitetura respeita `routes -> controllers -> services -> repositories`. |

## 5. Modelo de dados (metadados do documento)

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | UUID v4 público e único. |
| originalName | string | Nome do arquivo recebido no upload. |
| size | number | Tamanho do arquivo em bytes. |
| uploadedAt | string | Data/hora UTC em ISO 8601. |
| owner | string | Valor de `X-User-Id`. |
| storedName | string | Nome físico único, interno e não exposto pela API. |
| storagePath | string | Caminho local, interno e não exposto pela API. |
| mimeType | string | Tipo MIME recebido, usado na resposta de download. |

## 6. Contratos de API

O frontend usa o prefixo `/api`; o proxy Vite o remove antes de encaminhar as chamadas ao backend.

### POST /upload

- Entrada: `multipart/form-data` com campo `file` e cabeçalho `X-User-Id`.
- Sucesso: `201 Created` com `{ id, originalName, size, uploadedAt, owner }`.
- Falhas: `400 OWNER_REQUIRED`, `400 FILE_REQUIRED`, `413 FILE_TOO_LARGE`, `500 INTERNAL_ERROR`.

### GET /documents

- Entrada: cabeçalho `X-User-Id`.
- Sucesso: `200 OK` com uma lista de `{ id, originalName, size, uploadedAt, owner }` do proprietário.
- Falhas: `400 OWNER_REQUIRED`, `500 INTERNAL_ERROR`.

### GET /documents/:id/download

- Entrada: cabeçalho `X-User-Id` e `id` UUID no caminho.
- Sucesso: `200 OK` com conteúdo binário, `Content-Type` original e `Content-Disposition: attachment`.
- Falhas: `400 OWNER_REQUIRED`, `404 DOCUMENT_NOT_FOUND`, `500 INTERNAL_ERROR`.

## 7. Decisões arquiteturais

- Rotas configuram Multer e delegam aos controllers.
- Controllers validam cabeçalhos e dados HTTP, traduzindo respostas e erros.
- Services aplicam regras de proprietário, transformação de metadados e orquestram o fluxo.
- Repositories isolam os metadados em memória e a leitura dos arquivos locais.
- O frontend React usa componentes e `fetch` por meio de `/api`.

## 8. Plano de execução

1. Configurar as variáveis `PORT` e `STORAGE_PATH` e preparar o diretório local.
2. Implementar o repositório de metadados em memória e leitura de arquivos.
3. Implementar o serviço para criação, listagem filtrada e download autorizado.
4. Implementar controller, middleware Multer, rotas e tratamento de erros.
5. Cobrir upload, listagem, download, cabeçalho obrigatório e isolamento por usuário com testes backend.
6. Criar o cliente `fetch` e os componentes React para seleção, upload, listagem e download.
7. Validar o build do frontend e o fluxo manual integrado via proxy `/api`.