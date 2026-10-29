# Roteiro de homologação manual — AltoAcesso MVP

## Antes dos testes

Execute `python3 -m http.server 8000` na pasta do projeto e abra `http://localhost:8000/`. Use sempre dados fictícios. Para reiniciar a sessão, clique em **Sair**; se for preciso, apague as entradas de demonstração do armazenamento local pelo DevTools.

## Roteiro completo por perfil

1. No login, selecione **Cidadão**. Confirme que os campos do médico ficam ocultos; use nome e CPF inventados; entrar deve levar ao painel ilustrativo.
2. Pelo painel, acesse **Solicitações**. Um único registro de paciente exemplificativo deve ficar visível; testar filtros e a tela de detalhes sem ver ações de auditoria.
3. Em **Renovação**, verifique a validação quando código e arquivo estiverem vazios. Depois informe qualquer código, marque a confirmação e salve. Confira o registro na tabela de solicitações e no painel.
4. Em **Alertas**, conferir avisos de datas históricas e que “Ativar lembrete” não promete uma notificação real.
5. Clique em **Sair** e tente abrir diretamente `/pages/painel.html`; o acesso visual demonstrativo deve retornar ao login.
6. Em **Cadastro**, escolher paciente; preencher etapas 1 e 2 com dados inventados; ao concluir, verificar a mensagem “Cadastro realizado com sucesso!” e o retorno ao login, sem entrada automática no painel.
7. Em **Recuperação**, testar SMS e e-mail; verificar que as mensagens informam que nada foi enviado.
8. No login, selecione **Médico**. Confirmar visibilidade de CRM e credencial médica. Entrar.
9. No painel médico, testar filtros da tabela de **Solicitações** e exportar CSV com os resultados filtrados.
10. Em **Documentos**, verificar que o perfil médico pode aprovar, solicitar correção e recusar, exigindo justificativa para as duas últimas ações.
11. Em **Novo Rascunho**, testar CPF inexistente, CPF do exemplo (`987.654.321-11`), posologia e confirmação. Anexar imagem PNG/JPG de até 300 KB da assinatura, conferir prévia, salvar o rascunho, atualizar a página para verificar persistência e excluir o rascunho. Testar arquivo PDF e imagem acima de 300 KB (devem ser recusados).
12. Em **Alertas do médico**, filtrar paciente e navegar até o cartão de detalhe; voltar para lista.
13. Repetir login, menu, cartões, formulários, tabelas e links em **desktop** e em **390px de largura**. A rolagem horizontal, quando necessária, deve ficar dentro do contêiner da tabela.
14. Confirmar que não existe barra ou botões de acessibilidade (A−, A+ e LIBRAS) em nenhuma das nove telas; verificar navegação por Tab, foco visível, contraste e mensagens legíveis.
15. Abrir DevTools Console e Network. Não devem ocorrer erros JavaScript, nem chamadas a Gov.br, SUS/CRM ou serviços externos.

## Evidências de testes automatizados disponíveis

`resultado-testes.json` registra 23 verificações aprovadas de DOM e CSS executadas com Chromium isolado. As imagens da versão anterior foram retiradas porque continham textos desatualizados.

**Atenção:** esses testes não demonstram que a navegação por links e arquivos servidos por HTTP funciona ponta a ponta. O ambiente de testes bloqueou a abertura HTTP e o acesso local a arquivos no Chromium e, por isso, a homologação manual descrita acima ainda é necessária.

## Persistência e anexos (verificações adicionais)

1. Crie uma renovação com **código** e outra usando um arquivo PDF, PNG ou JPG com até **750 KB**.
2. Abra **Solicitações** e filtre por “Salva no navegador”. Confira os novos registros.
3. Abra **Ver documentos** em uma solicitação local. Baixe o anexo; anexe outro arquivo; visualize a prévia de uma imagem.
4. Recarregue as páginas e confirme que solicitações e documentos continuam disponíveis.
5. Exclua um anexo; exclua uma solicitação e confirme que seus anexos deixam de constar.
6. Teste arquivo de tipo não permitido, arquivo maior que 750 KB e falta de espaço no armazenamento.
7. Verifique que os arquivos não são enviados em requisições de rede e que o estado é particular ao navegador. Não use dados reais.

## Teste das decisões locais

1. Entre como médico e abra **Gerenciamento de Solicitações**. Escolha um registro e clique em **Ver detalhes**.
2. Pressione **Solicitar Correção** sem justificativa; a página deve exigir o preenchimento.
3. Escreva uma justificativa e confirme. O status deve mudar para **Pendente de Documento** na página atual e na lista de solicitações depois de recarregar.
4. Faça o mesmo para **Aprovar Solicitação** e **Reprovar Processo**. O último também deve exigir uma justificativa; deve resultar em **Recusado**.
5. Abra uma solicitação salva na tela de renovação, solicite uma correção como médico; entre como paciente e anexe o documento pedido. O pedido deve voltar para **Em Análise**.
6. Teste as opções de filtro por **Aprovado**, **Pendente de Documento** e **Recusado**.
7. Confira que o paciente vê status e justificativa, mas não os botões de decisão.
8. Os dados e decisões persistem apenas neste navegador. Use somente dados fictícios.


## Status nos dois perfis
1. Entre como médico, abra Gerenciamento e altere o pedido de Antônio (`EX-2`) para **Pendente de Documento**, informando uma justificativa.
2. Volte à lista de Gerenciamento: confira o novo status e a justificativa.
3. Saia, entre como paciente e abra Painel: o mesmo pedido deve aparecer como **Pendente de Documento**, com a justificativa e sem botões de auditoria.
4. Abra os detalhes e anexe um arquivo fictício PDF, JPG ou PNG de até 750 KB; o status deve retornar a **Em Análise**.
5. Entre novamente como médico e confira que tanto a lista quanto os detalhes mostram **Em Análise**.
6. Repita com uma solicitação criada na tela de Renovação; confira também persistência após recarregar a página.
7. Em duas abas da mesma origem, altere o status em uma e confira a atualização na outra sem precisar recarregar.
8. Confira que o paciente não vê solicitações pertencentes a outros CPFs fictícios.

## PDF do rascunho de prescrição

1. Entre como **Médico**, informando nome e CRM, e abra a tela **Prescrição**.
2. Verifique se nome e CRM aparecem nos campos da prescrição. Altere-os se necessário.
3. Busque o paciente disponível, selecione medicamento e duração, preencha frequência e anexe imagem PNG ou JPG de assinatura de até 300 KB.
4. Marque a confirmação e clique em **Salvar rascunho**; verifique o resumo com nome e CRM.
5. Clique em **Gerar PDF do rascunho**. Confira paciente, CPF, medicamento, frequência, duração, médico, CRM, data e imagem da assinatura na folha A4.
6. Clique em **Imprimir / Salvar como PDF**; escolha **Salvar como PDF** no diálogo do navegador e confirme que o arquivo contém as informações.
7. Recarregue a página de pré-visualização e confirme a persistência. Modifique os dados no formulário, salve novamente e verifique a nova saída.
8. Exclua o rascunho e tente acessar a página de PDF; ela deverá informar que não foi encontrado um rascunho completo.

**Testes automatizados isolados executados:** 26 verificações aprovadas para formulário, persistência, modelo impresso, imagem, conteúdo textual do PDF, perfil, ausência de rascunho e erros JavaScript. A navegação completa HTTP deverá ser homologada em ambiente local.


## Filtro de período por calendários e status compartilhados

1. Entre como **Médico** e abra **Gerenciamento de Solicitações**. Confira dois campos nativos de calendário: **De** e **Até**.
2. Escolha **19/03/2026** e **22/03/2026**. Devem aparecer os registros de José, Francisca e Antônio. Os limites devem ser incluídos.
3. Selecione **Aprovado** no filtro de status e confira apenas José e Antônio (antes de decisões adicionais).
4. Clique em **Limpar datas**. O filtro por status deve permanecer selecionado.
5. Teste um intervalo invertido: o sistema deve informar que a data inicial precisa ser anterior ou igual à final.
6. Entre como médico, abra a solicitação de Antônio (**EX-2**) e clique em **Solicitar Correção**, informando justificativa. Volte ao Gerenciamento: EX-2 deve ter **Pendente de Documento**.
7. Saia e entre como **Cidadão**, no mesmo navegador. Em **Minhas Solicitações** e no **Painel**, a solicitação EX-2 deve mostrar **Pendente de Documento** e a justificativa.
8. Volte como médico, aprovada a solicitação, confira que o status passa para **Aprovado** em ambas as telas. Repita para recusa e verifique a justificativa.
9. Abra duas abas da mesma origem e observe a atualização por evento `storage`. Não espere atualização entre dispositivos ou navegadores independentes.
10. Crie uma solicitação local e confira que os dois calendários também a incluem quando o período selecionado contém sua data.
