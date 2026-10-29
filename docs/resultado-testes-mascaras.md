# Atualização — Rodapé e máscaras

- Rodapé do painel: a seção **Canais** foi removida e a **Legislação** contém LGPD, Estatuto da Pessoa Idosa e Estatuto da Pessoa com Deficiência.
- Removido o telefone 136 dos cabeçalhos públicos das páginas.
- Acrescentado `scripts/masks.js` com formatação automática para CPF, CEP, telefone, UF, CRM, RQE e campos que aceitam CPF ou texto.
- A implementação não altera as informações armazenadas previamente nem depende de bibliotecas externas.
- Os campos estruturados utilizam `pattern`, `maxlength` e `inputmode` quando apropriado.
- Testes isolados no Chromium: **17 casos de máscara**, além de verificação de campos incompletos e sintaxe JavaScript. O script automatizado concluiu **155 verificações** de arquivos, estrutura e máscaras sem falhas.
- Testes de navegação HTTP ponta a ponta não foram realizados nesta atualização.
