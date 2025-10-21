const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const links = document.querySelectorAll('.menu a');
const anoAtualSpan = document.getElementById('ano-atual');
const formulario = document.getElementById('form-contato');

if (anoAtualSpan) {
    anoAtualSpan.textContent = new Date().getFullYear();
}

if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        const aberto = menu.classList.toggle('is-aberto');
        menuToggle.setAttribute('aria-expanded', aberto);
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('is-aberto')) {
                menu.classList.remove('is-aberto');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

const secoes = document.querySelectorAll('section[id]');

const observarSecoes = () => {
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                const id = entrada.target.getAttribute('id');
                const link = document.querySelector(`.menu a[href="#${id}"]`);
                if (!link) return;

                if (entrada.isIntersecting) {
                    link.classList.add('is-active');
                } else {
                    link.classList.remove('is-active');
                }
            });
        },
        {
            threshold: 0.6,
        }
    );

    secoes.forEach((secao) => observador.observe(secao));
};

observarSecoes();

const mensagensErro = {
    nome: 'Informe seu nome completo.',
    email: 'Digite um e-mail válido (ex: nome@dominio.com).',
    mensagem: 'Escreva uma mensagem com pelo menos 10 caracteres.',
};

const validarCampo = (campo, erroSpan) => {
    let valido = true;
    let mensagem = '';

    const valor = campo.value.trim();

    if (!valor) {
        valido = false;
        mensagem = mensagensErro[campo.name];
    } else if (campo.name === 'email') {
        const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!regexEmail.test(valor)) {
            valido = false;
            mensagem = mensagensErro.email;
        }
    } else if (campo.name === 'mensagem' && valor.length < 10) {
        valido = false;
        mensagem = mensagensErro.mensagem;
    }

    if (!valido) {
        campo.classList.add('tem-erro');
        erroSpan.textContent = mensagem;
    } else {
        campo.classList.remove('tem-erro');
        erroSpan.textContent = '';
    }

    return valido;
};

if (formulario) {
    const campos = formulario.querySelectorAll('input, textarea');

    campos.forEach((campo) => {
        const erroSpan = document.getElementById(`erro-${campo.name}`);
        campo.addEventListener('blur', () => validarCampo(campo, erroSpan));
        campo.addEventListener('input', () => validarCampo(campo, erroSpan));
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        let tudoValido = true;

        campos.forEach((campo) => {
            const erroSpan = document.getElementById(`erro-${campo.name}`);
            const campoValido = validarCampo(campo, erroSpan);
            if (!campoValido) {
                tudoValido = false;
            }
        });

        if (tudoValido) {
            alert('Mensagem enviada com sucesso!');
            formulario.reset();
        }
    });
}
