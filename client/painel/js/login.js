document.addEventListener("DOMContentLoaded", function (event) {
    login.event.init();
});

var login = {};

login.event = {

    init: () => {

        document.querySelector("#btnLogin").onclick = () => {
            login.method.validarLogin();
        }

    }

}

login.method = {

    // Valida os campos
    validarLogin: () => {

        let email = document.querySelector("#txtEmailLogin").value.trim();
        let senha = document.querySelector("#txtSenhaLogin").value.trim();

        if (email.length == 0) {
            app.method.mensagem("Informe o e-mail, por favor.");
            document.querySelector("#txtEmailLogin").focus();
            return;
        }

        if (senha.length == 0) {
            app.method.mensagem("Informe a senha, por favor.");
            document.querySelector("#txtSenhaLogin").focus();
            return;
        }

        login.method.login(email, senha);

    },

    // método que faz o login (via API)
    login: (email, senha) => {

        var dados = {
            email: email,
            senha: senha
        }

        app.method.post('/login', JSON.stringify(dados),
            (response) => {

                if (response.status == 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                if (response.status == "success") {

                    app.method.gravarValorSessao(response.TokenAcesso, "token");
                    app.method.gravarValorSessao(response.Nome, "Nome");
                    app.method.gravarValorSessao(response.Email, "Email");
                    app.method.gravarValorSessao(response.Logo, "Logo");

                    window.location.href = "/painel/home.html";

                }

            },
            (error) => {
                console.log(error);
            }, true
        )

    }

}