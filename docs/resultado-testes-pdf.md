# Verificação do PDF do rascunho

- Foram executados **26 testes isolados**, todos aprovados, com Chromium e armazenamento local de teste em memória.
- O modelo gerou um PDF **A4, uma página**, com os dados de paciente, CPF, medicamento, frequência, duração, nome e CRM do médico.
- A imagem de assinatura anexada foi renderizada corretamente no documento.
- O botão de impressão acionou a função nativa de impressão (com `window.print()` substituído por um observador nos testes).
- Foram verificadas situações de rascunho inexistente e perfil de paciente.
- Nenhum erro JavaScript foi observado nesses cenários isolados.
- Limitação: a navegação ponta a ponta por URL não foi executada, porque o Chromium do ambiente bloqueia esse tipo de navegação.
- O arquivo `amostra-rascunho-prescricao.pdf` contém apenas dados e assinatura **fictícios**, utilizados na verificação visual do modelo A4.
