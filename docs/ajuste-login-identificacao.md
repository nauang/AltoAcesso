# Login simplificado — CRM sem UF

- Cidadão: CPF e senha.
- Médico: somente número do CRM (1 a 8 dígitos) e senha.
- UF do CRM permanece na terceira etapa do cadastro médico.
- O campo de login aceita apenas algarismos; foi removida a máscara CRM-UF.
- A senha continua obrigatória e com no mínimo oito caracteres; não é armazenada.
- Sem Back-End, o login é uma navegação local por perfil, não uma verificação de credenciais ou do vínculo entre número do CRM e UF.
- Números de CRM podem coincidir em UFs diferentes; um sistema real precisaria resolver a identificação inequívoca no servidor.
