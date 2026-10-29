# Revisão de layout responsivo — AltoAcesso

## Ajustes realizados

- **Cabeçalho (320–440 px):** reduzidas as dimensões do logotipo e do avatar e exibido apenas o ícone no botão de voltar ao painel em telefones estreitos, mantendo seu texto acessível; corrigido o transbordamento horizontal.
- **Alertas e prazos:** reorganizados o ícone, o nome do medicamento e o indicador de status em duas linhas em telas pequenas. Os cartões não ultrapassam mais a largura disponível.
- **Renovação:** resumo de paciente e medicamento passa a uma coluna abaixo de 521 px, impedindo que CPF e textos sejam cortados.
- **Prescrição:** acrescido espaçamento entre o CRM do médico e o upload da imagem da assinatura.
- **Tabelas de solicitações e alertas:** mantidas em região com rolagem horizontal própria, com instrução visual nos dispositivos menores e foco por teclado.
- **Grids e campos:** elementos que precisam encolher receberam limites de largura para evitar transbordamento.

## Conferências realizadas

- 10 documentos HTML verificados (incluindo o modelo de impressão).
- 9 larguras de tela verificadas nas 10 páginas principais: 320, 375, 390, 600, 768, 900, 1024, 1280 e 1440 px, totalizando 90 configurações.
- Nenhuma dessas configurações apresentou largura total do documento superior à janela após as correções. A rolagem das tabelas permanece intencional e limitada ao componente.
- Integridade das referências relativas para CSS, JS, imagens e navegação.
- Verificação de sintaxe de 5 arquivos JavaScript e análise sintática de 4 arquivos CSS.
- Nenhum ID HTML duplicado encontrado.
- Modelo de prescrição (pré-visualização da página de PDF) conferido adicionalmente de 320 a 1024 px quanto ao transbordamento horizontal.

## Limitação dos testes

As inspeções visuais utilizaram renderização de HTML e CSS em Chromium, com conteúdo estático. O navegador do ambiente bloqueia a abertura de URLs de aplicações locais, portanto os fluxos completos de login, troca de perfil e navegação em HTTP não foram executados nesta rodada. Esses testes precisam ser verificados na execução local do projeto.

A revisão alterou CSS e, nas duas páginas com tabelas, apenas inseriu a indicação de rolagem e atributos de região; nenhuma rotina de negócio ou armazenamento foi modificada.
