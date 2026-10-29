# Correção do alinhamento dos filtros de solicitações

Arquivo alterado: `styles/adaptacoes.css`.

- Os títulos **Buscar por CPF ou nome**, **Filtrar por Status** e **Período de Solicitação** iniciam na mesma linha em telas desktop.
- Campos de busca, seleção de status, calendários **De / Até** e botão **Filtrar** têm o mesmo alinhamento vertical e altura de 54 px em desktop.
- Mantidos os dois calendários nativos, a ação **Limpar datas** e todas as funções de filtro.
- Em tablets, os dois filtros iniciais aparecem lado a lado e o período ocupa a linha seguinte. O botão fica abaixo.
- Em celulares, os filtros são empilhados para evitar campos estreitos.
- O JavaScript não foi modificado.

A checagem visual foi feita em Chromium para 12 larguras (320–1727 px), sem overflow lateral da página. A checagem de geometria confirmou alinhamento idêntico dos cinco controles em desktop. A captura representativa está em `docs/filtro-alinhamento-1280.png`.
