# Ajuste dos seletores Estado e UF do CRM

Os dois campos do cadastro passam a apresentar menus roláveis de no máximo 260 px de altura, com rolagem por mouse, touch e teclado. A lista se posiciona acima do campo quando não há espaço suficiente abaixo. O `select` original é mantido para registrar a UF, atualizar os dados do formulário e validar preenchimento. São 27 opções em cada campo. Não foram introduzidas bibliotecas, e nenhuma outra funcionalidade foi alterada.

Para conferir: no cadastro de paciente, avance ao passo Endereço e selecione Estado; no cadastro médico, avance até Credenciais Médicas e abra UF do CRM. Percorra as 27 opções e confirme que Tocantins pode ser selecionado. Faça também em resolução de celular e com o seletor perto do limite inferior da tela.

### Verificações executadas

Em Chromium isolado foram conferidos os dois menus (27 opções, rolagem visível e seleção de TO), em 320, 375, 768 e 1280 px, sem erro de JavaScript. Os cadastros completos de paciente e médico passaram com rolagem por roda do mouse, validação de Estado obrigatório e escolha de UF do CRM. A navegação entre páginas pelo servidor HTTP não foi executada neste ambiente.
