document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-cadastro');
    if (!formulario) return;
    const avisoGeral = document.getElementById('cadastro-aviso');
    const botaoEnviar = document.getElementById('btn-prosseguir');
    const textoOriginalBotao = botaoEnviar.textContent;
    const SENHA_MINIMA = 8;
    const LETRAS = 'A-Za-zÀ-ÖØ-öø-ÿ';
    formulario.noValidate = true;

    /* ---------- Máscaras ---------- */

    // 000.000.000-00
    function formatarCpf(valor) {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    // (11) 3000-0000 ou (11) 90000-0000
    function formatarTelefone(valor) {
        const n = valor.replace(/\D/g, '').slice(0, 11);
        if (n.length === 0) return '';
        if (n.length <= 2) return '(' + n;
        if (n.length <= 6) return '(' + n.slice(0, 2) + ') ' + n.slice(2);
        if (n.length <= 10) return '(' + n.slice(0, 2) + ') ' + n.slice(2, 6) + '-' + n.slice(6);
        return '(' + n.slice(0, 2) + ') ' + n.slice(2, 7) + '-' + n.slice(7);
    }

    /* ---------- Regras de validação ---------- */
    // Cada função devolve a mensagem de erro, ou '' quando o valor está correto

    function validarNome(valor) {
        const nome = valor.trim().replace(/\s+/g, ' ');
        if (nome === '') return 'Informe seu nome completo.';

        const somenteLetras = new RegExp('^[' + LETRAS + "' ’-]+$");
        if (!somenteLetras.test(nome)) return 'O nome deve conter apenas letras.';

        const temLetra = new RegExp('[' + LETRAS + ']');
        const palavras = nome.split(' ').filter((palavra) => temLetra.test(palavra));
        if (palavras.length < 2) return 'Digite seu nome e sobrenome.';

        return '';
    }


    function validarCpf(valor) {
        if (valor.replace(/\D/g, '').length !== 11) return 'O CPF deve ter 11 números.';
        return '';
    }

    function validarEmail(valor) {
        const email = valor.trim();
        if (email === '') return 'Informe seu e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'E-mail inválido. Exemplo: nome@email.com';
        }
        return '';
    }

    function validarTelefone(valor) {
        const total = valor.replace(/\D/g, '').length;
        if (total !== 10 && total !== 11) return 'Digite o DDD e o número (10 ou 11 dígitos).';
        return '';
    }

    function validarSenha(valor) {
        if (valor === '') return 'Crie uma senha.';
        if (valor.length < SENHA_MINIMA) {
            return 'A senha deve ter pelo menos ' + SENHA_MINIMA + ' caracteres.';
        }
        if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) {
            return 'A senha deve conter letras e números.';
        }
        return '';
    }

    const campos = [
        {
            campo: document.getElementById('nome'),
            mensagem: document.getElementById('nome-erro'),
            validar: validarNome
        },
        {
            campo: document.getElementById('cpf'),
            mensagem: document.getElementById('cpf-erro'),
            validar: validarCpf,
            mascara: formatarCpf
        },
        {
            campo: document.getElementById('email'),
            mensagem: document.getElementById('email-erro'),
            validar: validarEmail
        },
        {
            campo: document.getElementById('telefone'),
            mensagem: document.getElementById('telefone-erro'),
            validar: validarTelefone,
            mascara: formatarTelefone
        },
        {
            campo: document.getElementById('senha'),
            mensagem: document.getElementById('senha-erro'),
            validar: validarSenha
        }
    ];


    function verificar(item) {
        const erro = item.validar(item.campo.value);
        item.mensagem.textContent = erro;

        if (erro) {
            item.campo.classList.add('campo-invalido');
            item.campo.setAttribute('aria-invalid', 'true');
            return false;
        }

        item.campo.classList.remove('campo-invalido');
        item.campo.removeAttribute('aria-invalid');
        return true;
    }

    /* ---------- Eventos ---------- */

    campos.forEach((item) => {
        // Aplica a máscara e revalida enquanto digita (só se já houver erro)
        item.campo.addEventListener('input', () => {
            if (item.mascara) item.campo.value = item.mascara(item.campo.value);
            if (item.campo.classList.contains('campo-invalido')) verificar(item);
            avisoGeral.textContent = '';
        });

        // Valida ao sair do campo, se algo foi digitado
        item.campo.addEventListener('blur', () => {
            if (item.campo.value.trim() !== '') verificar(item);
        });
    });

    // Validação final no envio do formulário
    formulario.addEventListener('submit', (evento) => {
        let primeiroInvalido = null;

        campos.forEach((item) => {
            if (!verificar(item) && primeiroInvalido === null) {
                primeiroInvalido = item.campo;
            }
        });

        if (primeiroInvalido !== null) {
            evento.preventDefault();
            avisoGeral.textContent = 'Corrija os campos destacados para continuar.';
            primeiroInvalido.focus();
            return;
        }

        avisoGeral.textContent = '';
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Enviando...';
    });

    // Reativa o botão se o usuário voltar para esta página pelo navegador
    window.addEventListener('pageshow', () => {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = textoOriginalBotao;
    });
});