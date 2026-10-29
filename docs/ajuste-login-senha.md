# Padronização do login por senha

- Cidadão: nome completo, CPF e senha.
- Médico: nome, CPF, CRM e senha.
- A senha substituiu o campo chamado **Credencial Médica** no login.
- Os dois perfis exigem no mínimo oito caracteres.
- A senha é apagada do formulário antes da transição e não é armazenada pelo projeto.
- A versão permanece sem Back-End; senha preenchida não significa credenciais verificadas.

## Verificação

Foram testadas as validações de comprimento mínimo, alternância entre perfis e submissão dos formulários em ambiente isolado. A navegação completa entre arquivos não pôde ser automatizada devido ao bloqueio do navegador neste ambiente.
