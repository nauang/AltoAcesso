# Ajuste do painel médico e do aviso no rodapé

- A seção de boas-vindas **Olá, Seu Antônio** e o botão **Iniciar Guia** são exclusivos do perfil de cidadão. O médico não vê o banner.
- Os atalhos do médico agora usam os textos **Ver Solicitações** e **Ver Prazos**.
- Removido do rodapé o texto **Não utilize dados pessoais reais neste ambiente.** e seu estilo exclusivo.
- Demais elementos de navegação, filtros e armazenamento foram preservados.

## Como testar

1. Entre como **Médico**: o painel não deve mostrar o banner dirigido a Antônio. Os atalhos devem ter textos de médico.
2. Volte ao login e entre como **Cidadão**: o banner deve aparecer, desde que não tenha sido dispensado anteriormente.
3. Em ambas as sessões, o rodapé não deve conter a frase removida.
4. Se o banner já tiver sido dispensado em testes anteriores, limpe a chave `altoacesso-guide-dismissed` do `localStorage` antes de testar sua aparição no perfil de cidadão.
