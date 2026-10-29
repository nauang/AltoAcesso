# AltoAcesso

**Protótipo acadêmico de uma plataforma web para acompanhamento de solicitações de medicamentos de alto custo.**

## Sobre o projeto

O AltoAcesso foi concebido para facilitar a consulta de informações, a organização de documentos e o acompanhamento de etapas relacionadas à solicitação e à renovação de medicamentos de alto custo.

O projeto busca explorar soluções que, futuramente, possam contribuir para reduzir deslocamentos, filas e dificuldades enfrentadas por pacientes e cuidadores. **A versão atual é uma demonstração acadêmica de interface e fluxos de uso, não um serviço de saúde em operação.**

## Público-alvo

- **Cidadãos/pacientes:** pessoas que precisam acompanhar solicitações e renovações de medicamentos.
- **Médicos:** profissionais que, no protótipo, podem visualizar solicitações, registrar decisões e preparar rascunhos de prescrições.
- **Cuidadores:** pessoas que auxiliam pacientes no acompanhamento de seus processos.

## Funcionalidades do protótipo

- **Login demonstrativo por perfil:** cidadão com CPF e senha; médico com número do CRM e senha. A UF do CRM é informada no cadastro. O acesso é simulado e **não autentica a identidade do usuário**.
- **Cadastro em etapas:** formulários com máscaras, campos de UF e validações no navegador.
- **Painéis por perfil:** navegação e informações apresentadas conforme o perfil selecionado.
- **Solicitações:** consulta, filtros por período e status e acompanhamento de registros de exemplo ou salvos localmente.
- **Documentos:** inclusão e visualização de arquivos compatíveis com os limites de armazenamento do navegador.
- **Análise médica demonstrativa:** aprovação, reprovação ou solicitação de correção, com atualização de status no mesmo navegador.
- **Renovação:** fluxo demonstrativo para consultar ou iniciar uma solicitação de renovação.
- **Prescrições:** preenchimento de rascunho, inclusão de imagem de assinatura e visualização para impressão ou salvamento em PDF pelo navegador. **Não constitui prescrição médica válida nem assinatura digital certificada.**
- **Alertas e barra contextual:** informações e contadores de pendências por perfil, calculados a partir dos dados disponíveis localmente.
- **Recuperação de acesso:** interface demonstrativa, sem envio real de SMS ou e-mail.
- **Interface responsiva:** adaptação para computadores e dispositivos móveis.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (DOM, eventos, formulários e validações)
- `localStorage` e `sessionStorage` para simulações e armazenamento local

**Não utiliza** back-end, banco de dados remoto, frameworks JavaScript nem integrações com Gov.br, SUS ou conselhos profissionais.

## Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/nauang/AltoAcesso.git
   cd AltoAcesso
   ```

2. Na pasta do projeto, inicie um servidor HTTP local:

   ```bash
   python3 -m http.server 8000
   ```

3. Abra `http://localhost:8000/` no navegador.

Não há dependências a instalar nem etapa de compilação.

## Estrutura principal

```text
AltoAcesso/
├── index.html        # Entrada e login demonstrativo
├── assets/icons/     # Ícones utilizados na interface
├── pages/            # Telas do sistema
├── scripts/          # Lógica JavaScript
├── styles/           # Estilos CSS
├── docs/             # Registros, exemplos e roteiro de testes
└── README.md
```

## Limitações e cuidados

- Os registros e anexos locais **não são compartilhados entre dispositivos** e podem ser perdidos ao limpar os dados do navegador.
- Os perfis e as decisões sobre solicitações são **simulados**. Não há validação real de CPF, CRM, identidade ou autorização profissional.
- Não existe emissão de protocolo oficial, integração com serviços públicos, envio de notificações remotas ou assinatura digital com validade jurídica.
- **Utilize somente dados e documentos fictícios nos testes.** O protótipo não oferece as proteções necessárias para armazenar informações reais de saúde.

## Objetivos de Desenvolvimento Sustentável (ODS)

O projeto se relaciona, como proposta de impacto futuro, aos seguintes ODS:

| ODS | Descrição |
|---|---|
| **8** | Trabalho Decente e Crescimento Econômico |
| **9** | Indústria, Inovação e Infraestrutura |
| **16** | Paz, Justiça e Instituições Eficazes |
| **17** | Parcerias e Meios de Implementação |

**Impacto social pretendido:** facilitar o acompanhamento dos processos, reduzir barreiras de acesso à informação e apoiar pacientes e cuidadores.

## Equipe de desenvolvimento

- Yago Feliciano de Miranda Soardi
- Nauan Gomes de Lima
- Rodrigo Eiji de Paula Taniguti
- Carlos Augusto Alves Reis

## Disciplina

- **Curso:** PI: Desenvolvimento de Sistemas Web
- **Código:** 218040
- **Turma:** 101
- **Professor:** Fernando Luiz de Almeida Silveira
