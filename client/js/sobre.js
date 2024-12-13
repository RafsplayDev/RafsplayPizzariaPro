document.addEventListener("DOMContentLoaded", function (event) {
    app.event.init();
    sobre.event.init();
});

var sobre = {};

var DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

sobre.event = {

    init: () => {

        sobre.method.obterDadosEmpresa();
        sobre.method.obterHorariosFuncionamento();
        sobre.method.obterFormasPagamento();

    }

}

sobre.method = {

    // obtem os dados da empresa
    obterDadosEmpresa: () => {

        app.method.get('/empresa/sobre',
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                document.querySelector("#lblNomeEmpresa").innerText = response.data[0].nome;

                if (response.data[0].sobre != null) {
                    document.querySelector("#lblSobreEmpresa").innerHTML = response.data[0].sobre.replace(/\\n/g, '<br>');
                }
                else {
                    document.querySelector(".infos-sub").remove();
                }

                if (response.data[0].logotipo != null) {
                    document.querySelector('#imgLogoEmpresa').style.backgroundImage = `url('/public/images/empresa/${response.data[0].logotipo}')`;
                    document.querySelector('#imgLogoEmpresa').style.backgroundSize = '70%';
                }
                else {
                    document.querySelector('#imgLogoEmpresa').remove();
                }

                if (response.data[0].endereco != null) {

                    // valida o complemento
                    let comp = response.data[0].complemento != null ? ` (${response.data[0].complemento})` : '';

                    let empresa = response.data[0];

                    document.querySelector('#lblEnderecoEmpresa').innerText = `${empresa.endereco}, ${empresa.numero}${comp} - ${empresa.bairro}, ${empresa.cidade}-${empresa.estado}`;

                }


            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }, true
        );

    },

    // obtem os horarios de funcionamento da empresa
    obterHorariosFuncionamento: () => {

        app.method.loading(true);

        app.method.get('/empresa/horario',
            (response) => {

                console.log(response)
                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                sobre.method.carregarHorarios(response.data);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }, true
        );

    },

    // carrega os horarios da empresa
    carregarHorarios: (list) => {

        if (list.length > 0) {

            document.querySelector('#horarioFuncionamento').classList.remove('hidden');

            list.forEach((e, i) => {

                let textoDia = '';
                let textoHorario = `${e.iniciohorarioum} às ${e.fimhorarioum}`;

                // valida o segundo horario
                if (e.iniciohorariodois != null && e.iniciohorariodois != '' && e.fimhorariodois != null && e.fimhorariodois != '') {
                    textoHorario += ` - ${e.iniciohorariodois} às ${e.fimhorariodois}`;
                }

                // valida o dia da semana
                if (e.diainicio != e.diafim) {
                    textoDia = `${DIAS_SEMANA[e.diainicio]} a ${DIAS_SEMANA[e.diafim]}`;
                }
                else {
                    textoDia = DIAS_SEMANA[e.diainicio];
                }


                let temp = sobre.templates.horario.replace(/\${dia}/g, textoDia)
                    .replace(/\${horario}/g, textoHorario)


                document.querySelector('#horarioFuncionamento').innerHTML += temp;

            })

        }
        else {
            document.querySelector('#horarioFuncionamento').remove();
        }

    },

    // obtem as formas de pagamento da empresa
    obterFormasPagamento: () => {

        app.method.get('/formapagamento',
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                sobre.method.carregarFormasPagamento(response.data);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }, true
        );

    },

    // carrega as formas de pagamento na tela
    carregarFormasPagamento: (list) => {

        if (list.length > 0) {

            document.querySelector('#formasPagamento').classList.remove('hidden');

            list.forEach((e, i) => {

                let temp = sobre.templates.formaPagamento.replace(/\${forma}/g, e.nome)

                document.querySelector('#formasPagamento').innerHTML += temp;

            })

        }
        else {
            document.querySelector('#formasPagamento').remove();
        }

    },


}

sobre.templates = {

    horario: `
        <div class="card mt-2">
            <p class="normal-text mb-0"><b>\${dia}</b></p>
            <p class="normal-text mb-0">\${horario}</p>
        </div>
    `,

    formaPagamento: `
        <div class="card mt-2">
            <p class="normal-text mb-0"><b>\${forma}</b></p>
        </div>
    `

}