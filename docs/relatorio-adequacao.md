# Relatório técnico — AltoAcesso: adequação do código após o feedback da 2ª entrega

## 1. Diagnóstico e solução

O professor reconheceu a qualidade do protótipo e a organização do grupo, mas apontou incompatibilidade entre o escopo anunciado (Gov.br, SUS/CRM, ICP-Brasil, prescrições, upload, histórico e perfis persistentes) e a arquitetura planejada (somente Front-End e armazenamento local).

**Decisão:** manter a identidade visual e a navegação das nove telas extraídas de `App.tsx`/`index.css`, apresentando um **MVP de demonstração de interface** desenvolvido exclusivamente com HTML5, CSS3 e JavaScript puro. Não se propõe entregar um serviço de saúde funcional durante o semestre.

**Classificação corrigida:** **Web responsiva** (visualização em desktop e celular), não Web e Mobile como dois produtos separados. O uso de `localStorage` não foi classificado como banco de dados.

## 2. Matriz de viabilidade das funcionalidades

| Módulo | O que o código entrega neste semestre | O que NÃO entrega / evolução futura |
|---|---|---|
| Login / perfis | Seleção visual Cidadão/Médico e sessão de laboratório | Autenticação de pessoa, validação CPF/CRM, integração Gov.br |
| Cadastro | Formulário 2/3 etapas e validação de preenchimento | Registro de conta, persistência de dados pessoais e verificação de credenciais |
| Dashboard | Cartões, navegação, status de pedidos fixos | Acompanhamento em tempo real |
| Solicitações | Filtro por texto/status; dados fictícios; CSV visível | Consulta a sistemas públicos, histórico/relatório real |
| Renovação | Busca em lista local e teste do código `DEMO-1234`; confirmação ilustrativa | Upload, guarda de laudos, protocolo oficial, código de uso único real |
| Prescrição | Rascunho com imagem da assinatura carregada do computador e gravada localmente | Receita emitida, prontuário, assinatura ICP-Brasil |
| Documentos | Visualizador de laudo fictício e zoom | Auditoria local com aprovação, correção e recusa, status e justificativa persistidos no navegador |
| Alertas | Exemplos fixos de datas e lembrete puramente visual | Notificações/SMS/e-mails e cálculo real de vencimentos |
| Recuperação | Seleção visual SMS/e-mail e aviso local | Redefinição de senha ou envio de mensagem |
| Interface acessível | Foco visível, rótulos e HTML semântico | Barra de ajustes A−/A+ e tradução por LIBRAS |

## 3. Alterações feitas diretamente no código

- `scripts/main.js`: o estado de demonstração aceita somente `patient` e `doctor`; o token da aula 15 é comparado ao **exemplo exato**, evitando aceitar qualquer texto com aparência de JWT na demonstração. **Isso continua sem ser autenticação segura**. A exportação CSV respeita as linhas visíveis depois do filtro. A análise de solicitações foi implementada com decisões e persistência local, sem autenticação ou aprovação oficial.
- `scripts/forms.js`: cadastro concluído apresenta **“Cadastro realizado com sucesso!”**, limpa o formulário e não faz login automático (a confirmação se refere ao fluxo de formulário, não à criação de conta persistente); prescrição exige busca do paciente fictício e permite salvar um rascunho com imagem da assinatura; renovação utiliza um **código de teste conhecido** e confirma a inexistência de registro/envio.
- `pages/cadastro.html`: uma única tag `main`, link para conteúdo principal e mensagem final com retorno ao login demonstrativo.
- `pages/documentos.html`: comandos de aprovação, solicitação de correção e recusa habilitados para o perfil médico; justificativa obrigatória para correção e recusa.
- `pages/prescricao.html`: assinatura eletrônica substituída por **upload PNG/JPG com pré-visualização e armazenamento local no rascunho**, sem certificação de assinatura.
- `pages/renovacao.html`: código `DEMO-1234`; botão renomeado para “Conferir renovação” e envio de laudos não implementado.
- `pages/painel.html`: removidas menções a consultas “em tempo real” e emissão efetiva de solicitações.
- Todas as telas: removidas as faixas repetitivas, substituindo-as por textos naturais e objetivos.
- `styles/adaptacoes.css`: estilos dos formulários, mensagens e botões indisponíveis, preservando a paleta e o layout existentes.

## 4. Arquitetura viável para o semestre

```text
Navegador (aplicação Web responsiva)
    ├── HTML5: telas, formulários e tabelas
    ├── CSS3: visual e responsividade (Flexbox / Grid)
    ├── JavaScript: DOM, eventos, validações e filtros
    ├── Arrays e objetos: dados fictícios predefinidos
    └── Web Storage: preferência visual, perfil de demonstração e JWT didático

SEM: Back-End, API externa, banco de dados de produção, credenciais
     reais, validação profissional, assinatura digital ou serviços oficiais.
```

As ações que exigiriam uma arquitetura de produção não são simuladas como se fossem processos verdadeiros. O protótipo pode demonstrar **como seriam** essas telas, mas não provar segurança, conformidade LGPD ou interoperabilidade governamental. Esse desenho reduz a dependência de equipe especializada, infraestrutura, contratos e dados sensíveis no semestre.

## 5. Ligação com as aulas

| Recurso implementado | Material-base da disciplina |
|---|---|
| Estrutura estática do protótipo e organização de diretórios | Aulas 03 e 04 |
| HTML5 semântico, títulos, metadados, listas, tabelas | Aulas 05, 06 e 07; Labs. 01 e 02 |
| Formulários, inputs e validação básica | Aula 08 |
| CSS externo, seletores, variáveis, `:focus` e `:hover` | Aula 09; Lab. 03 |
| Flexbox, Grid, Media Queries, tabelas responsivas | Aula 10; Lab. 04 |
| Variáveis, funções, arrays e condicionais JavaScript | Aula 11 |
| Seleção/alteração de elementos via DOM e classes CSS | Aula 12 |
| `addEventListener`, `submit`, `preventDefault`, feedback | Aula 13; Lab. 05 |
| `localStorage`, `sessionStorage`, JSON | Aula 14 |
| JWT educativo não verificado criptograficamente | Aula 15; Lab. 06 |

**Observação:** requisitos particulares dos laboratórios não foram confundidos com telas obrigatórias do sistema.

## 6. Evidências de validação

- Sintaxe dos dois scripts verificada com `node --check`.
- Na versão anterior, 23/23 verificações de interação visual/DOM passaram em Chromium isolado, com armazenamento simulado nos testes; relatório machine-readable em `resultado-testes.json`.
- Capturas antigas removidas após atualização dos textos da interface, pois não representam mais a versão atual.
- Na versão anterior, nas seis telas amostradas em 390px não houve overflow horizontal. A revisão textual atual ainda não passou por teste de navegador.
- **Limitação:** a política do navegador de teste bloqueou HTTP local. Não foi possível concluir a sequência de navegação real entre URLs; a validação ponta a ponta deve ser repetida em um navegador local, como descrito em `roteiro-testes.md`.
- O arquivo original de design no Figma e seus frames não estavam disponíveis, logo não há garantia de fidelidade pixel a pixel. Os estilos CSS e os ícones SVG foram preservados da exportação recebida.

## 7. Escopo final e próximos passos

**MVP do semestre:** demonstração funcional no navegador das nove telas, separação HTML/CSS/JS, validação simples, navegação, perfis visuais, listagens/filtros, exemplo de rascunho e renovação, feedback acessível e relatório técnico.

**Evolução futura:** Back-End, banco de dados estruturado, controles de autorização seguros, mecanismos de segurança e privacidade, aprovação formal e rastreabilidade clínica em servidor, upload com armazenamento seguro, assinatura ICP-Brasil, integrações Gov.br/SUS/CRM, notificações e APIs oficiais. Esses itens dependem de requisitos legais, infraestrutura, credenciais e aprovações ainda não disponíveis.

**Nota ética e de segurança:** exemplificação de tratamentos, dosagens e dados de pacientes **não representa orientação clínica**. Não inserir dados reais em formulários ou ambientes de demonstração.


## Revisão da interface (28/10/2026)
Foram retiradas as faixas gerais e os rótulos de classificação do projeto repetidos em cada página. Os títulos, navegação e chamadas foram simplificados, mantendo mensagens objetivas nos fluxos sem envio real, assinatura eletrônica ou autenticação verificada. As capturas anteriores da interface foram removidas para evitar prévias desatualizadas.

## Atualização da interface

Removida a barra superior com os controles A−, A+ e LIBRAS, inclusive os estilos, ações JavaScript e ícone. Mantidos foco por teclado, rótulos de formulários e atributos semânticos.

## Atualização — persistência de solicitações e documentos

- Removidos os avisos solicitados das páginas de painel e renovação.
- `scripts/storage.js` adiciona persistência em `localStorage` para solicitações e anexos PDF, PNG e JPG em Base64 (máximo 750 KB por arquivo), tratando limite de armazenamento.
- Renovação registra solicitação com código livre e/ou anexo local (sem armazenar o código em texto), mantendo a busca de pacientes já existentes no protótipo.
- Solicitações salvas aparecem na tabela, nos filtros, no CSV e no painel; podem ser excluídas com os anexos correspondentes.
- A tela de documentos permite adicionar, visualizar e baixar anexos vinculados ao registro, além de removê-los.
- A persistência é exclusivamente no navegador e não constitui banco de dados seguro nem protocolo oficial de atendimento. Somente dados fictícios devem ser utilizados.

## Incremento: decisão de solicitações com localStorage

- Na área médica de **Documentos**, os botões **Aprovar Solicitação**, **Solicitar Correção** e **Reprovar Processo** gravam `status`, `reason` e `reviewedAt` no navegador.
- Correção exige justificativa e altera o status para **Pendente de Documento**; recusa exige justificativa e altera para **Recusado**; aprovação altera para **Aprovado**.
- As decisões das seis solicitações preexistentes ficam em `altoacesso-decisoes-exemplo-v1`. As decisões sobre solicitações criadas no formulário ficam em `altoacesso-solicitacoes-v1`.
- Status e justificativa ficam visíveis ao paciente (no registro que lhe corresponde); as ações de decisão são ocultadas para o perfil de paciente.
- Quando se anexa arquivo adicional a um pedido local que está **Pendente de Documento**, ele retorna para **Em Análise**.
- Tudo é armazenamento local, no mesmo navegador. Isso não equivale a sistema multiusuário, servidor ou autorização real e não deve receber dados de saúde verdadeiros.

## Geração de PDF a partir do rascunho de prescrição

A tela de prescrição agora contém nome e CRM do médico (preenchidos inicialmente a partir do login do perfil médico e editáveis antes do salvamento). O rascunho guarda esses campos junto ao paciente, CPF, medicamento, posologia, duração, data e imagem da assinatura no `localStorage` já existente.

Após salvar, o botão **Gerar PDF do rascunho** abre `pages/prescricao-pdf.html`, que recupera a mesma informação por `scripts/storage.js` e preenche um modelo A4 com `textContent` e a imagem carregada localmente. A impressão usa `window.print()` e estilos `@media print` em `styles/prescricao-pdf.css`. O usuário escolhe **Salvar como PDF** no diálogo nativo do navegador. Portanto, o PDF não é baixado automaticamente por uma biblioteca nem enviado a servidores.

A imagem é um anexo gráfico, não uma assinatura digital certificada. O documento traz a identificação **Rascunho de Prescrição**. A função é local, sem integração com sistemas externos. Um modelo preenchido com dados fictícios encontra-se em `docs/amostra-rascunho-prescricao.pdf`.
