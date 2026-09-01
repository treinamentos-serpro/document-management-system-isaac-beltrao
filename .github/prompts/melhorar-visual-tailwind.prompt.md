---
description: "Melhora a interface operacional do DMS com Tailwind CSS 3, preservando seus fluxos funcionais."
name: melhorar-visual-tailwind
argument-hint: "direção visual opcional, ex.: painel operacional claro e compacto"
agent: tailwind-ui-designer
---

# Melhorar Visual com Tailwind CSS 3

Melhore o visual do frontend do Document Management System usando Tailwind CSS 3.

Direção visual: `${input:direcao:direção visual desejada}`

Trabalhe somente em `frontend/`.

## Preservar

- Upload de arquivo com limite de 100 MB.
- Seleção do usuário atual.
- Listagem, carregamento, estado vazio e mensagens de erro.
- Download de documentos.
- Cliente HTTP em `frontend/src/services/documentService.js` usando o prefixo `/api`.
- Componentes funcionais, Hooks e tema Tailwind já configurado.

## Implementar

1. Leia a interface atual e aplique uma direção visual coesa ao DMS.
2. Use exclusivamente classes utilitárias do Tailwind CSS 3 e o tema configurado no projeto.
3. Mantenha uma interface operacional clara, compacta, responsiva e acessível.
4. Garanta contraste adequado, foco visível, estados `disabled` e textos sem estouro em telas pequenas.
5. Evite alterar endpoints, payloads, regras de negócio ou arquivos de backend.
6. Evite duplicar componentes ou lógica existente.
7. Execute `npm run build` em `frontend` e corrija erros encontrados.

Ao final, informe a direção visual aplicada, os arquivos alterados e o resultado da validação.