document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-login');
    if (!formulario) return;

    const campoCpf = document.getElementById('cpf');
    const campoSenha = document.getElementById('senha');
    const erroCpf = document.getElementById('cpf-erro');
    const erroSenha = document.getElementById('senha-erro');
    const avisoGeral = document.getElementById('login-aviso');
    const botaoEntrar = document.getElementById('btn-entrar');
    const textoOriginalBotao = botaoEntrar.textContent;
    const SENHA_MINIMA = 8;
    formulario.noValidate = true;


    function mostrarErro(campo, elementoMensagem, texto) {
        elementoMensagem.textContent = texto;
        campo.classList.add('campo-invalido');
        campo.setAttribute('aria-invalid', 'true');
    }

    function limparErro(campo, elementoMensagem) {
        elementoMensagem.textContent = '';
        campo.classList.remove('campo-invalido');
        campo.removeAttribute('aria-invalid');
    }

    // Formata o CPF enquanto o usuário digita: 000.000.000-00
    function formatarCpf(valor) {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    /* ---------- Validação de cada campo ---------- */

    function validarCpf() {
        if (campoCpf.value.replace(/\D/g, '').length !== 11) {
            mostrarErro(campoCpf, erroCpf, 'O CPF deve ter 11 números.');
            return false;
        }
        limparErro(campoCpf, erroCpf);
        return true;
    }

    function validarSenha() {
        const valor = campoSenha.value;

        if (valor === '') {
            mostrarErro(campoSenha, erroSenha, 'Digite sua senha.');
            return false;
        }
        if (valor.length < SENHA_MINIMA) {
            mostrarErro(campoSenha, erroSenha,
                'A senha deve ter pelo menos ' + SENHA_MINIMA + ' caracteres.');
            return false;
        }

        limparErro(campoSenha, erroSenha);
        return true;
    }

    /* ---------- Eventos ---------- */

    // Máscara do CPF e revalidação enquanto digita (só se já houver erro)
    campoCpf.addEventListener('input', () => {
        campoCpf.value = formatarCpf(campoCpf.value);
        if (campoCpf.classList.contains('campo-invalido')) validarCpf();
        avisoGeral.textContent = '';
    });

    campoSenha.addEventListener('input', () => {
        if (campoSenha.classList.contains('campo-invalido')) validarSenha();
        avisoGeral.textContent = '';
    });

    // Valida ao sair do campo, se algo foi digitado
    campoCpf.addEventListener('blur', () => {
        if (campoCpf.value.trim() !== '') validarCpf();
    });

    campoSenha.addEventListener('blur', () => {
        if (campoSenha.value !== '') validarSenha();
    });

    // Validação final no envio do formulário
    formulario.addEventListener('submit', (evento) => {
        const cpfOk = validarCpf();
        const senhaOk = validarSenha();

        if (!cpfOk || !senhaOk) {
            evento.preventDefault();
            avisoGeral.textContent = 'Corrija os campos destacados para continuar.';
            (cpfOk ? campoSenha : campoCpf).focus();
            return;
        }

        avisoGeral.textContent = '';
        botaoEntrar.disabled = true;
        botaoEntrar.textContent = 'Entrando...';
    });

    // Reativa o botão se o usuário voltar para esta página pelo navegador
    window.addEventListener('pageshow', () => {
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = textoOriginalBotao;
    });
});