# Verificação do fluxo de decisões — 28/10/2026

Foram realizados testes de interação no Chromium com páginas isoladas (HTML e scripts carregados na memória) e armazenamento local simulado. Esses testes não incluem navegação HTTP ponta a ponta, que foi bloqueada neste ambiente.

- Perfil médico: botões de auditoria visíveis e habilitados.
- Correção: exige justificativa; grava **Pendente de Documento** no armazenamento de exemplos e de solicitações locais.
- Aprovação: grava **Aprovado** em solicitação local.
- Recusa: exige justificativa; grava **Recusado**.
- Exibição: justificativa e status aparecem ao consultar novamente o registro.
- Perfil paciente: visualiza o status, sem botões de decisão.
- Envio complementar: documento salvo no navegador; pedido **Pendente de Documento** retorna para **Em Análise**.
- Lista de solicitações: status persistente dos exemplos refletido na tabela após novo carregamento.
- Painel: status persistente refletido nos cartões, ocultando a retirada quando não está disponível.
- Verificações estáticas: sintaxe dos scripts, estrutura de IDs, CSS e referências locais.

**Limitação:** As operações são locais ao navegador, sem transmissão entre dispositivos, sem autorização de médico verificável e sem controle institucional real de solicitações. Não devem ser utilizadas com dados pessoais ou clínicos reais.
