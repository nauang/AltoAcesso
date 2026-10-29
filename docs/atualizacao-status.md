# Integração de status — AltoAcesso

## Mudanças

- Os status **Em Análise**, **Pendente de Documento**, **Aprovado** e **Recusado** são recuperados do mesmo armazenamento local nas páginas de solicitações, painel e documentos. Os registros iniciais têm sua própria chave de alterações, e os novos pedidos são mantidos em outra chave.
- As alterações do médico atualizam o histórico. O paciente visualiza o status correspondente e a justificativa, quando cadastrada.
- O painel do paciente mostra somente registros do CPF fictício **987.654.321-11**. Os cartões estáticos inconsistentes foram substituídos por cartões gerados a partir dos registros.
- A página de documentos aceita anexos em solicitações novas e nos registros iniciais. Quando há pendência de documento, o anexo complementar faz o status retornar a **Em Análise**.
- A atualização ocorre na própria aba via evento interno, em outras abas da mesma origem por meio do evento `storage`, e na navegação normal quando a página é aberta.
- Não foi incorporado Back-End, API, banco de dados remoto, framework ou biblioteca externa.

## Testes realizados

As verificações de DOM no Chromium passaram para: filtro por CPF, justificativas, atualização na aba atual e pelo evento `storage`, aprovação, correção, anexo complementar, retorno para **Em Análise** e sincronização ao recarregar os registros. Não ocorreram erros JavaScript nos cenários testados.

A verificação por navegação real HTTP ponta a ponta não foi possível porque o ambiente bloqueia a abertura de URLs no Chromium. Faça também os testes manuais de `docs/roteiro-testes.md` em `http://localhost:8000`.

## Limitação de arquitetura

O armazenamento e a sincronização funcionam **somente no mesmo navegador e na mesma origem**. O `localStorage` não compartilha dados entre computadores ou navegadores distintos. O login é ilustrativo e não implementa autenticação segura. Não utilize dados pessoais, médicos ou documentos reais.
