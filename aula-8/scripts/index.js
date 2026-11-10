
function executar(evento) {
    evento.preventDefault();

    limparForm();
    const valido = validarForm();

    if (valido) {
        enviarDadosParaAPI();
    }
}

function aplicarMascaraTelefone() {
    const telefone = document.querySelector("#telefone");

    if (!telefone) {
        return;
    }

    telefone.addEventListener("input", () => {
        const valores = telefone.value.replace(/\D/g, "").slice(0, 11);
        let valorMascarado = "";

        if (valores.length <= 2) {
            valorMascarado = valores;
        } else if (valores.length <= 7) {
            valorMascarado = `(${valores.slice(0, 2)}) ${valores.slice(2)}`;
        } else {
            valorMascarado = `(${valores.slice(0, 2)}) ${valores.slice(2, 7)}-${valores.slice(7)}`;
        }

        telefone.value = valorMascarado;
    });
}

function validarCampo(id, mensagem) {
    const campo = document.querySelector(`#${id}`);
    const erro = document.querySelector(`#erro-${id}`);
    const valor = campo.value.trim();

    if (valor === "") {
        erro.textContent = mensagem;
        erro.classList.add("erro");
        erro.classList.remove("oculto");
        return false;
    }

    erro.classList.add("oculto");
    erro.classList.remove("erro");
    return true;
}

function validarForm() {
    const campos = [
        ["nome", "É obrigatório preencher o nome!"],
        ["idade", "É obrigatório preencher a idade!"],
        ["email", "É obrigatório preencher o email!"],
        ["telefone", "É obrigatório preencher o telefone!"],
        ["endereco", "É obrigatório preencher o endereço!"],
        ["cidade", "É obrigatório preencher a cidade!"],
        ["estado", "É obrigatório preencher o estado!"],
        ["cep", "É obrigatório preencher o CEP!"],
        ["senha", "É obrigatório preencher a senha!"],
        ["confirmar-senha", "É obrigatório preencher a confirmação da senha!"]
    ];

    let valido = true;

    campos.forEach(([id, mensagem]) => {
        if (!validarCampo(id, mensagem)) {
            valido = false;
        }
    });

    const email = document.querySelector("#email").value.trim();
    const erroEmail = document.querySelector("#erro-email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        erroEmail.textContent = "Informe um email válido!";
        erroEmail.classList.add("erro");
        erroEmail.classList.remove("oculto");
        valido = false;
    }

    const idade = Number(document.querySelector("#idade").value);
    const erroIdade = document.querySelector("#erro-idade");
    if (document.querySelector("#idade").value !== "" && idade < 18) {
        erroIdade.textContent = "É necessário ter 18 anos!";
        erroIdade.classList.add("erro");
        erroIdade.classList.remove("oculto");
        valido = false;
    }

    const telefone = document.querySelector("#telefone").value.replace(/\D/g, "");
    const erroTelefone = document.querySelector("#erro-telefone");
    if (telefone && telefone.length < 10) {
        erroTelefone.textContent = "Telefone inválido!";
        erroTelefone.classList.add("erro");
        erroTelefone.classList.remove("oculto");
        valido = false;
    }

    const senha = document.querySelector("#senha").value;
    const confirmarSenha = document.querySelector("#confirmar-senha").value;
    const erroConfirmarSenha = document.querySelector("#erro-confirmar-senha");
    if (senha && confirmarSenha && senha !== confirmarSenha) {
        erroConfirmarSenha.textContent = "As senhas não conferem!";
        erroConfirmarSenha.classList.add("erro");
        erroConfirmarSenha.classList.remove("oculto");
        valido = false;
    }

    const termos = document.querySelector("#termos");
    const erroTermos = document.querySelector("#erro-termos");
    if (!termos.checked) {
        erroTermos.textContent = "É preciso aceitar os termos!";
        erroTermos.classList.add("erro");
        erroTermos.classList.remove("oculto");
        valido = false;
    }

    const concluido = document.querySelector("#concluido");
    if (!valido) {
        concluido.textContent = "Corrija os erros antes de prosseguir!";
        concluido.classList.add("erro");
        concluido.classList.remove("oculto");
    } else {
        concluido.textContent = "Cadastro concluido com sucesso!";
        concluido.classList.add("sucesso");
        concluido.classList.remove("oculto");
    }

    return valido;
}

async function enviarDadosParaAPI() {
    const dados = {
        nome: document.querySelector("#nome").value.trim(),
        idade: document.querySelector("#idade").value.trim(),
        email: document.querySelector("#email").value.trim(),
        telefone: document.querySelector("#telefone").value.trim(),
        endereco: document.querySelector("#endereco").value.trim(),
        cidade: document.querySelector("#cidade").value.trim(),
        estado: document.querySelector("#estado").value.trim(),
        cep: document.querySelector("#cep").value.trim(),
        senha: document.querySelector("#senha").value.trim(),
        confirmarSenha: document.querySelector("#confirmar-senha").value.trim()
    };

    try {
        const resposta = await fetch("https://postman-echo.com/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const retorno = await resposta.json();
        alert(`Resposta da API:\n${JSON.stringify(retorno, null, 2)}`);
    } catch (erro) {
        alert(`Erro ao enviar os dados: ${erro.message}`);
    }
}

//() ==> {} arrow function
function limparForm() {
    document.querySelectorAll(".erro").forEach((item) => {
        item.classList.remove("erro");
        item.classList.add("oculto");
    });
    document.querySelector("#concluido").classList.add("oculto");
}

window.addEventListener("DOMContentLoaded", aplicarMascaraTelefone);