document.addEventListener("DOMContentLoaded", function (event) {
    empresa.event.init();
});

var empresa = {};
var DADOS_EMPRESA = {};

var MODAL_UPLOAD = new bootstrap.Modal(document.getElementById('modalUpload'));

var DROP_AREA = document.getElementById("drop-area");

empresa.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();

        var tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipList.map(function (element) {
            new bootstrap.Tooltip(element)
        });

        // inicia a primeira TAB
        empresa.method.openTab('sobre');

        // inicializa o drag e drop da imagem

        // previne os comportamentos padrões do navegador
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            DROP_AREA.addEventListener(eventName, empresa.method.preventDefaults, false);
            document.body.addEventListener(eventName, empresa.method.preventDefaults, false);
        });

        // Evento quando passa o mouse em cima com a imagem segudara (hover)
        ['dragenter', 'dragover'].forEach(eventName => {
            DROP_AREA.addEventListener(eventName, empresa.method.highlight, false);
        });

        // Evento quando sai com mouse de cima
        ['dragleave', 'drop'].forEach(eventName => {
            DROP_AREA.addEventListener(eventName, empresa.method.unhighlight, false);
        });

        // Evento quando solta a imagem no container
        DROP_AREA.addEventListener('drop', empresa.method.handleDrop, false);

        // inicializa a mascara de cep
        $('.cep').mask('00000-000');

    }

}

empresa.method = {

    // responsavel por abrir as TABS e chamar os metodos inicias de cada uma
    openTab: (tab) => {

        Array.from(document.querySelectorAll(".tab-content")).forEach(e => e.classList.remove('active'));
        Array.from(document.querySelectorAll(".tab-item")).forEach(e => e.classList.add('hidden'));

        document.querySelector("#tab-" + tab).classList.add('active');
        document.querySelector("#" + tab).classList.remove('hidden');

        switch (tab) {
            case 'sobre':
                empresa.method.obterDados();
                break;

            case 'endereco':
                empresa.method.obterDados();
                break;

            case 'horario':
                empresa.method.obterHorarios();
                break;

            default:
                break;
        }

    },

    // obtem os dados da empresa
    obterDados: () => {

        app.method.get('/empresa/sobre',
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                let empresa = response.data[0];

                DADOS_EMPRESA = empresa;

                // Carrega a TAB sobre

                if (empresa.logotipo != null && empresa.logotipo != '') {
                    document.getElementById("img-empresa").style.backgroundImage = `url('../public/images/empresa/${empresa.logotipo}')`;
                    document.getElementById("img-empresa").style.backgroundSize = '70%';
                    document.getElementById("btn-editar-logo").classList.add('hidden');
                    document.getElementById("btn-remover-logo").classList.remove('hidden');
                }
                else {
                    document.getElementById("img-empresa").style.backgroundImage = `url('../public/images/default.jpg')`;
                    document.getElementById("img-empresa").style.backgroundSize = 'cover';
                    document.getElementById("btn-editar-logo").classList.remove('hidden');
                    document.getElementById("btn-remover-logo").classList.add('hidden');
                }

                document.getElementById("txtNomeEmpresa").value = empresa.nome;
                document.getElementById("txtSobreEmpresa").innerHTML = empresa.sobre.replace(/\n/g, '\r\n');

                // Carrega a TAB endereço

                document.getElementById("txtCEP").value = empresa.cep;
                document.getElementById("txtEndereco").value = empresa.endereco;
                document.getElementById("txtBairro").value = empresa.bairro;
                document.getElementById("txtNumero").value = empresa.numero;
                document.getElementById("txtCidade").value = empresa.cidade;
                document.getElementById("txtComplemento").value = empresa.complemento;
                document.getElementById("ddlUf").value = empresa.estado;


            },
            (error) => {
                console.log('error', error)
            }
        );

    },

    // valida os campos e salva os dados da empresa (TAB sobre)
    salvarDadosSobre: () => {

        let nome = document.getElementById("txtNomeEmpresa").value.trim();
        let sobre = document.getElementById("txtSobreEmpresa").value.trim();

        if (nome.length <= 0) {
            app.method.mensagem('Informe o nome da empresa, por favor.');
            document.getElementById("txtNomeEmpresa").focus();
            return;
        }

        let dados = {
            nome: nome,
            sobre: sobre
        }

        app.method.loading(true);

        app.method.post('/empresa/sobre', JSON.stringify(dados),
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // atualizar o localstorage
                app.method.gravarValorSessao(nome, 'Nome');

                empresa.method.obterDados();
                app.method.carregarDadosEmpresa();

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );


    },

    // adiciona a nova logo da empresa
    uploadLogo: (logoUpload = []) => {

        MODAL_UPLOAD.hide();

        var formData = new FormData();

        if (logoUpload != undefined) {
            formData.append('image', logoUpload[0])
        }
        else {
            formData.append('image', document.querySelector('#fileElem').files[0]);
        }

        app.method.loading(true);

        app.method.upload('/image/logo/upload', formData,
            (response) => {

                console.log(response)

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // atualiza o valor no localstorage
                app.method.gravarValorSessao(response.logotipo, 'Logo');

                empresa.method.obterDados();
                app.method.carregarDadosEmpresa();

            },
            (error) => {
                console.log('error', error)
                app.method.loading(false);
            }
        );

    },

    // remove o logo da empresa
    removeLogo: () => {

        var data = {
            imagem: DADOS_EMPRESA.logotipo
        }

        app.method.loading(true);

        app.method.post('/image/logo/remove', JSON.stringify(data),
            (response) => {

                console.log(response)

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // atualiza o valor no localstorage
                app.method.removerSessao('Logo');

                empresa.method.obterDados();
                app.method.carregarDadosEmpresa();

            },
            (error) => {
                console.log('error', error)
                app.method.loading(false);
            }
        );

    },

    // abre a modal de adicionar logo
    openModalLogo: () => {

        MODAL_UPLOAD.show();

    },

    // DRAG AND DROP - previne os comportamentos padrões
    preventDefaults: (e) => {
        e.preventDefault();
        e.stopPropagation();
    },

    // DRAG AND DROP - adiciona a classe 'highlight' quando entra com a imagem no container
    highlight: (e) => {
        if (!DROP_AREA.classList.contains('highlight')) {
            DROP_AREA.classList.add('highlight');
        }
    },

    // DRAG AND DROP - remove a classe 'highlight' quando sai com a imagem no container
    unhighlight: (e) => {
        DROP_AREA.classList.remove('highlight');
    },

    // DRAG AND DROP - quando solta a imagem no container
    handleDrop: (e) => {
        var dt = e.dataTransfer;
        var files = dt.files;

        empresa.method.uploadLogo(files);
    },

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = document.getElementById('txtCEP').value.trim().replace(/\D/g, '');

        if (cep != '') {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            // Valida o formato do CEP.
            if (validacep.test(cep)) {

                // cria um elemento javascript
                var script = document.createElement('script');

                // sincroniza com o callback
                script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=empresa.method.callbackCep';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            }
            else {
                app.method.mensagem('Formato do CEP inválido.');
                document.getElementById('txtCEP').focus();
            }

        }
        else {
            app.method.mensagem('Informe o CEP, por favor.');
            document.getElementById('txtCEP').focus();
        }

    },

    // método chamado quando retorna algo da API de CEP
    callbackCep: (dados) => {

        if (!("erro" in dados)) {

            // Atualiza os campos com os valores retornados
            document.getElementById("txtEndereco").value = dados.logradouro;
            document.getElementById("txtBairro").value = dados.bairro;
            document.getElementById("txtCidade").value = dados.localidade;
            document.getElementById("ddlUf").value = dados.uf;
            document.getElementById("txtNumero").focus();

        }
        else {
            app.method.mensagem('CEP não encontrado. Preencha as informações manualmente.');
            document.getElementById('txtEndereco').focus();
        }

    },

    // salva os dados de endereço
    salvarDadosEndereco: () => {

        let cep = document.getElementById("txtCEP").value.trim();
        let endereco = document.getElementById("txtEndereco").value.trim();
        let bairro = document.getElementById("txtBairro").value.trim();
        let numero = document.getElementById("txtNumero").value.trim();
        let cidade = document.getElementById("txtCidade").value.trim();
        let complemento = document.getElementById("txtComplemento").value.trim();
        let uf = document.getElementById("ddlUf").value.trim();

        if (cep.length <= 0) {
            app.method.mensagem('Informe o CEP, por favor.');
            document.getElementById("txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            app.method.mensagem('Informe o Endereço, por favor.');
            document.getElementById("txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            app.method.mensagem('Informe o Bairro, por favor.');
            document.getElementById("txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            app.method.mensagem('Informe a Cidade, por favor.');
            document.getElementById("txtCidade").focus();
            return;
        }

        if (numero.length <= 0) {
            app.method.mensagem('Informe o Número, por favor.');
            document.getElementById("txtNumero").focus();
            return;
        }

        if (uf == "-1") {
            app.method.mensagem('Informe a UF, por favor.');
            document.getElementById("ddlUf").focus();
            return;
        }

        let dados = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            estado: uf,
            numero: numero,
            complemento: complemento
        }

        app.method.loading(true);

        app.method.post('/empresa/endereco', JSON.stringify(dados),
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                empresa.method.obterDados();
            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

    // obtem os horários da empresa
    obterHorarios: () => {

        document.getElementById("listaHorarios").innerHTML = '';

        app.method.get('/empresa/horario',
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                empresa.method.carregarHorarios(response.data);

            },
            (error) => {
                console.log('error', error)
            }
        );

    },

    // carrega os horarios na tela
    carregarHorarios: (lista) => {

        if (lista.length > 0) {

            lista.forEach((e, i) => {

                // cria um ID aleatório
                let id = Math.floor(Date.now() * Math.random()).toString();

                let temp = empresa.template.horario.replace(/\${id}/g, id)

                let htmlObject = document.createElement('div');
                htmlObject.classList.add('row', 'horario', 'mb-4');
                htmlObject.id = `horario-${id}`;
                htmlObject.innerHTML = temp;

                // adiciona o horario na tela
                document.getElementById("listaHorarios").appendChild(htmlObject);

                document.querySelector(`#diainicio-${id}`).value = e.diainicio;
                document.querySelector(`#diafim-${id}`).value = e.diafim;
                document.querySelector(`#iniciohorarioum-${id}`).value = e.iniciohorarioum;
                document.querySelector(`#fimhorarioum-${id}`).value = e.fimhorarioum;
                document.querySelector(`#iniciohorariodois-${id}`).value = e.iniciohorariodois;
                document.querySelector(`#fimhorariodois-${id}`).value = e.fimhorariodois;

            })

        }
        else {
            // nenhum horario encontrado, adicionar uma linha em branco
            empresa.method.adicionarHorario();
        }

    },

    // remove a linha do horario
    removerHorario: (id) => {
        document.getElementById(`horario-${id}`).remove();
    },

    // adicionar uma nova linha de horário
    adicionarHorario: () => {

        let adicionar = true;

        // primeiro valida se tem alguma linha sem registros
        document.querySelectorAll('#listaHorarios .horario').forEach((e, i) => {

            let _id = e.id.split('-')[1];

            let diainicio = document.querySelector(`#diainicio-${_id}`).value;
            let diafim = document.querySelector(`#diafim-${_id}`).value;
            let iniciohorarioum = document.querySelector(`#iniciohorarioum-${_id}`).value;
            let fimhorarioum = document.querySelector(`#fimhorarioum-${_id}`).value;

            if (diainicio <= -1 || diafim <= -1 || iniciohorarioum.length <= 0 || fimhorarioum.length <= 0) {
                adicionar = false;
                app.method.mensagem('Antes de adicionar outra linha, verifique se não existem campos em branco.');
            }

        });

        if (!adicionar) {
            return;
        }

        // cria um ID aleatório
        let id = Math.floor(Date.now() * Math.random()).toString();

        let temp = empresa.template.horario.replace(/\${id}/g, id)

        let htmlObject = document.createElement('div');
        htmlObject.classList.add('row', 'horario', 'mb-4');
        htmlObject.id = `horario-${id}`;
        htmlObject.innerHTML = temp;

        // adiciona o horario na tela
        document.getElementById("listaHorarios").appendChild(htmlObject);

    },

    // valida os campos e salva os horários
    salvarHorario: () => {

        let horarios = [];
        let continuar = true;

        // primeiro valida se tem alguma linha sem registros
        document.querySelectorAll('#listaHorarios .horario').forEach((e, i) => {

            let _id = e.id.split('-')[1];

            let diainicio = document.querySelector(`#diainicio-${_id}`).value;
            let diafim = document.querySelector(`#diafim-${_id}`).value;
            let iniciohorarioum = document.querySelector(`#iniciohorarioum-${_id}`).value;
            let fimhorarioum = document.querySelector(`#fimhorarioum-${_id}`).value;
            let iniciohorariodois = document.querySelector(`#iniciohorariodois-${_id}`).value;
            let fimhorariodois = document.querySelector(`#fimhorariodois-${_id}`).value;

            if (diainicio <= -1 || diafim <= -1 || iniciohorarioum.length <= 0 || fimhorarioum.length <= 0) {
                continuar = false;
                app.method.mensagem('Alguns campos obrigatórios não foram preenchidos.');
            }

            horarios.push({
                diainicio: diainicio,
                diafim: diafim,
                iniciohorarioum: iniciohorarioum,
                fimhorarioum: fimhorarioum,
                iniciohorariodois: iniciohorariodois,
                fimhorariodois: fimhorariodois
            })

        });

        if (!continuar || horarios.length <= 0) {
            return;
        }

        console.log('horarios', horarios);
        
        app.method.loading(true);

        app.method.post('/empresa/horario', JSON.stringify(horarios),
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                empresa.method.openTab('horario');

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

}

empresa.template = {

    horario: `
        <div class="col-2">
            <div class="form-group">
                <p class="title-categoria mb-0"><b>De *:</b></p>
                <select class="form-control" id="diainicio-\${id}">
                    <option value="-1">...</option>
                    <option value="0">Domingo</option>
                    <option value="1">Segunda</option>
                    <option value="2">Terça</option>
                    <option value="3">Quarta</option>
                    <option value="4">Quinta</option>
                    <option value="5">Sexta</option>
                    <option value="6">Sábado</option>
                </select>
            </div>
        </div>

        <div class="col-2">
            <div class="form-group">
                <p class="title-categoria mb-0"><b>até *:</b></p>
                <select class="form-control" id="diafim-\${id}">
                    <option value="-1">...</option>
                    <option value="0">Domingo</option>
                    <option value="1">Segunda</option>
                    <option value="2">Terça</option>
                    <option value="3">Quarta</option>
                    <option value="4">Quinta</option>
                    <option value="5">Sexta</option>
                    <option value="6">Sábado</option>
                </select>
            </div>
        </div>

        <div class="col-7">
            <div class="row">

                <div class="col-3">
                    <div class="form-group">
                        <p class="title-categoria mb-0"><b>das *:</b></p>
                        <input type="time" class="form-control" id="iniciohorarioum-\${id}"/>
                    </div>
                </div>

                <div class="col-3">
                    <div class="form-group">
                        <p class="title-categoria mb-0"><b>até as *:</b></p>
                        <input type="time" class="form-control" id="fimhorarioum-\${id}" />
                    </div>
                </div>

                <div class="col-3">
                    <div class="form-group">
                        <p class="title-categoria mb-0"><b>e das:</b></p>
                        <input type="time" class="form-control" id="iniciohorariodois-\${id}" />
                    </div>
                </div>

                <div class="col-3">
                    <div class="form-group">
                        <p class="title-categoria mb-0"><b>até as:</b></p>
                        <input type="time" class="form-control" id="fimhorariodois-\${id}" />
                    </div>
                </div>

            </div>
        </div>

        <div class="col-1">
            <a href="#!" class="btn btn-red btn-sm" onclick="empresa.method.removerHorario('\${id}')">
                <i class="fas fa-trash-alt"></i>
            </a>
        </div>
    `

}