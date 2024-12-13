document.addEventListener("DOMContentLoaded", function (event) {
    config.event.init();
});

var config = {};

var TAXA_UNICA_ID = 0;
var TAXA_DISTANCIA_SELECIONADA = 0;

config.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();

        // máscara para o campo de dinheiro
        $(".money").mask('#.##0,00', { reverse: true });

        // inicia a primeira TAB
        config.method.openTab('delivery-retirada');

    }

}


config.method = {

    // responsavel por abrir as TABS e chamar os metodos inicias de cada uma
    openTab: (tab) => {

        Array.from(document.querySelectorAll(".tab-content")).forEach(e => e.classList.remove('active'));
        Array.from(document.querySelectorAll(".tab-item")).forEach(e => e.classList.add('hidden'));

        document.querySelector("#tab-" + tab).classList.add('active');
        document.querySelector("#" + tab).classList.remove('hidden');

        switch (tab) {
            case 'delivery-retirada':
                config.method.obterConfigTipoEntrega();
                break;

            case 'taxa-entrega':
                config.method.obterConfigTaxaEntrega();
                break;

            case 'forma-pagamento':
                config.method.obterConfigFormaPagamento();
                break;

            default:
                break;
        }

    },


    // ------ TAB DELIVERY E RETIRADA ----------

    // obtem os tipos de entrega
    obterConfigTipoEntrega: () => {

        app.method.loading(true);

        app.method.get('/entrega/tipo',
            (response) => {

                app.method.loading(false);
                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                let delivery = response.data.filter((e) => { return e.idtipoentrega == 1 });
                let retirada = response.data.filter((e) => { return e.idtipoentrega == 2 });

                // validar as configs do delivery
                config.method.changeOpcaoDelivery(delivery[0].ativo);
                document.querySelector("#txtTempoMinimoDelivery").value = delivery[0].tempominimo != null ? delivery[0].tempominimo : '';
                document.querySelector("#txtTempoMaximoDelivery").value = delivery[0].tempomaximo != null ? delivery[0].tempomaximo : '';

                // valida as configs da retirada
                config.method.changeOpcaoRetirada(retirada[0].ativo);
                document.querySelector("#txtTempoMinimoRetirada").value = retirada[0].tempominimo != null ? retirada[0].tempominimo : '';
                document.querySelector("#txtTempoMaximoRetirada").value = retirada[0].tempomaximo != null ? retirada[0].tempomaximo : '';

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // clique na opção de retirada
    changeOpcaoRetirada: (isCheck) => {

        let check = document.querySelector('#chkOpcaoRetirada').checked;

        if (isCheck != undefined) {
            check = isCheck;
        }

        if (check) {
            document.querySelector('#chkOpcaoRetirada').checked = true;
            document.querySelector('#lblSwitchRetirada').innerText = 'Ligado';
            document.querySelector('#containerTempoRetirada').classList.remove('disabled');
            document.querySelector('#txtTempoMinimoRetirada').disabled = false;
            document.querySelector('#txtTempoMaximoRetirada').disabled = false;
            document.querySelector('#btnSalvarOpcaoRetirada').classList.remove('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoRetiradaCheck(true);
            }

        }   
        else {
            document.querySelector('#chkOpcaoRetirada').checked = false;
            document.querySelector('#lblSwitchRetirada').innerText = 'Desligado';
            document.querySelector('#containerTempoRetirada').classList.add('disabled');
            document.querySelector('#txtTempoMinimoRetirada').disabled = true;
            document.querySelector('#txtTempoMaximoRetirada').disabled = true;
            document.querySelector('#btnSalvarOpcaoRetirada').classList.add('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoRetiradaCheck(false);
            }

        }

    },

    // clique na opção de delivery
    changeOpcaoDelivery: (isCheck) => {

        let check = document.querySelector('#chkOpcaoDelivery').checked;

        if (isCheck != undefined) {
            check = isCheck;
        }

        if (check) {
            document.querySelector('#chkOpcaoDelivery').checked = true;
            document.querySelector('#lblSwitchDelivery').innerText = 'Ligado';
            document.querySelector('#containerTempoDelivery').classList.remove('disabled');
            document.querySelector('#txtTempoMinimoDelivery').disabled = false;
            document.querySelector('#txtTempoMaximoDelivery').disabled = false;
            document.querySelector('#btnSalvarOpcaoDelivery').classList.remove('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoDeliveryCheck(true);
            }

        }   
        else {
            document.querySelector('#chkOpcaoDelivery').checked = false;
            document.querySelector('#lblSwitchDelivery').innerText = 'Desligado';
            document.querySelector('#containerTempoDelivery').classList.add('disabled');
            document.querySelector('#txtTempoMinimoDelivery').disabled = true;
            document.querySelector('#txtTempoMaximoDelivery').disabled = true;
            document.querySelector('#btnSalvarOpcaoDelivery').classList.add('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoDeliveryCheck(false);
            }
            
        }

    },

    // salva a opção de ativar ou desativar (Retirada)
    salvarOpcaoRetiradaCheck: (ativar) => {

        app.method.loading(true);

        var dados = {
            tipo: 2,
            ativar: ativar ? 1 : 0
        }

        app.method.post('/entrega/tipo/ativar', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // salva a opção de ativar ou desativar (Delivery)
    salvarOpcaoDeliveryCheck: (ativar) => {

        app.method.loading(true);

        var dados = {
            tipo: 1,
            ativar: ativar ? 1 : 0
        }

        app.method.post('/entrega/tipo/ativar', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // salva as configurações da Retirada (tempo)
    salvarOpcaoRetirada: () => {

        let minimo = parseInt(document.querySelector('#txtTempoMinimoRetirada').value);
        let maximo = parseInt(document.querySelector('#txtTempoMaximoRetirada').value);

        if (isNaN(minimo) || minimo < 0) {
            app.method.mensagem('Tempo mínimo da retirada incorreto.');
            return;
        }

        if (isNaN(maximo) || maximo < 0) {
            app.method.mensagem('Tempo máximo da retirada incorreto.');
            return;
        }

        let dados = {
            tipo: 2,
            minimo: minimo,
            maximo: maximo
        }

        app.method.loading(true);

        app.method.post('/entrega/tipo', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // salva as configurações do Delivery (tempo)
    salvarOpcaoDelivery: () => {

        let minimo = parseInt(document.querySelector('#txtTempoMinimoDelivery').value);
        let maximo = parseInt(document.querySelector('#txtTempoMaximoDelivery').value);

        if (isNaN(minimo) || minimo < 0) {
            app.method.mensagem('Tempo mínimo do delivery incorreto.');
            return;
        }

        if (isNaN(maximo) || maximo < 0) {
            app.method.mensagem('Tempo máximo do delivery incorreto.');
            return;
        }

        let dados = {
            tipo: 1,
            minimo: minimo,
            maximo: maximo
        }

        app.method.loading(true);

        app.method.post('/entrega/tipo', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },


    // ------ TAB TAXA DE ENTREGA --------------

    // obtem as configurações iniciais da taxa de entrega
    obterConfigTaxaEntrega: () => {

        app.method.loading(true);

        app.method.get('/taxaentregatipo',
            (response) => {

                app.method.loading(false);
                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }       

                let taxaunica = response.data.filter((e) => { return e.idtaxaentregatipo == 1 });
                let taxadistancia = response.data.filter((e) => { return e.idtaxaentregatipo == 2 });
                let semtaxa = response.data.filter((e) => { return e.idtaxaentregatipo == 3 });
                
                document.querySelector('#chkSemTaxa').checked = semtaxa[0].ativo ? true : false;
                document.querySelector('#chkTaxaUnica').checked = taxaunica[0].ativo ? true : false;
                document.querySelector('#chkTaxaDistancia').checked = taxadistancia[0].ativo ? true : false;

                Array.from(document.querySelectorAll(".tab-item-taxa")).forEach(e => e.classList.add('hidden'));

                if (semtaxa[0].ativo) {
                    document.querySelector('#container-sem-taxa').classList.remove('hidden');
                }
                else if (taxaunica[0].ativo) {
                    document.querySelector('#container-taxa-unica').classList.remove('hidden');
                    config.method.listarTaxaUnica();
                }
                else if (taxadistancia[0].ativo) {
                    document.querySelector('#container-taxa-distancia').classList.remove('hidden');
                    config.method.listarTaxaDistancia();
                }

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // abre a tab da taxa selecionada
    openTabTaxa: (tab, pai) => {

        Array.from(document.querySelectorAll(".tab-item-taxa")).forEach(e => e.classList.add('hidden'));
        document.querySelector("#" + tab).classList.remove('hidden');

        document.querySelector("#chkSemTaxa").checked = false;
        document.querySelector("#chkTaxaUnica").checked = false;
        document.querySelector("#chkTaxaDistancia").checked = false;

        document.querySelector("#" + pai).checked = true;

        switch (tab) {
            case 'container-sem-taxa':
                config.method.obterConfigSemTaxa();
                break;

            case 'container-taxa-unica':
                config.method.obterConfigTaxaUnica();
                break;

            case 'container-taxa-distancia':
                config.method.obterConfigTaxaDistancia();
                break;

            default:
                break;
        }

    },

    // seta as configurações da tab Sem taxa
    obterConfigSemTaxa: () => {

        let dados = {
            semtaxa: 1,
            taxaunica: 0,
            taxadistancia: 0
        }

        TAXA_UNICA_ID = 0;

        app.method.loading(true);

        app.method.post('/taxaentregatipo/ativar', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // seta as configurações da tab Taxa única
    obterConfigTaxaUnica: () => {

        let dados = {
            semtaxa: 0,
            taxaunica: 1,
            taxadistancia: 0
        }

        app.method.loading(true);

        app.method.post('/taxaentregatipo/ativar', JSON.stringify(dados),
            (response) => {

                //app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                config.method.listarTaxaUnica();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // seta as configurações da tab Taxa por distância
    obterConfigTaxaDistancia: () => {

        let dados = {
            semtaxa: 0,
            taxaunica: 0,
            taxadistancia: 1
        }

        app.method.loading(true);

        app.method.post('/taxaentregatipo/ativar', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                config.method.listarTaxaDistancia();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // obtem as configurações da taxa unica
    listarTaxaUnica: () => {

        TAXA_UNICA_ID = 0;

        app.method.get('/taxaentregatipo/taxaunica',
            (response) => {

                app.method.loading(false);
                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                if (response.data.length > 0) {

                    TAXA_UNICA_ID = response.data[0].idtaxaentrega;

                    document.querySelector('#txtTaxaUnicaValor').value = (response.data[0].valor).toFixed(2).toString().replace('.', ',');
                    document.querySelector('#txtTaxaUnicaTempoMinimoEntrega').value = response.data[0].tempominimo;
                    document.querySelector('#txtTaxaUnicaTempoMaximoEntrega').value = response.data[0].tempomaximo;
                }
             
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // método para salvar as configs da taxa unica
    salvarTaxaUnica: () => {

        let valor = parseFloat(document.querySelector('#txtTaxaUnicaValor').value.replace(/\./g, '').replace(',', '.'));
        let tempominimo = parseFloat(document.querySelector('#txtTaxaUnicaTempoMinimoEntrega').value.trim());
        let tempomaximo = parseFloat(document.querySelector('#txtTaxaUnicaTempoMaximoEntrega').value.trim());

        if (isNaN(valor) || valor <= 0) {
            app.method.mensagem('Informe o valor da taxa, por favor.')
            return;
        }

        if (isNaN(tempominimo)) {
            tempominimo = '';
        }        

        if (isNaN(tempomaximo)) {
            tempomaximo = '';
        } 

        let dados = {
            idtaxaentrega: TAXA_UNICA_ID,
            valor: valor,
            tempominimo: tempominimo,
            tempomaximo: tempomaximo
        }

        app.method.loading(true);

        app.method.post('/taxaentregatipo/taxaunica', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                config.method.listarTaxaUnica();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );


    },

    // obtem as configurações da taxa por distancia
    listarTaxaDistancia: () => {

        app.method.get('/taxaentregatipo/taxadistancia',
            (response) => {

                app.method.loading(false);
                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                config.method.carregarListaTaxasDistancia(response.data);
             
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // método para carregar a lista das taxas por distancia cadastradas
    carregarListaTaxasDistancia: (list) => {

        document.querySelector('#listaTaxasDistancia').innerHTML = '';

        if (list.length > 0) {

            list.forEach((e, i) => {

                let tempo = '';
                let status = '<span class="badge badge-success">Ativado</span>';
                let acoes = `<a class="dropdown-item" href="#!" onclick="config.method.ativarTaxaDistancia('${e.idtaxaentrega}', 0)">
                                <i class="fas fa-ban"></i>&nbsp; <b>Desativar</b>
                            </a>`;


                // valida se existe tempo
                if ((e.tempominimo != null && e.tempominimo != '') && (e.tempomaximo != null && e.tempomaximo != '')) {
                    tempo = `de ${e.tempominimo} até ${e.tempomaximo} min`;
                }

                // valida o status
                if (e.ativo === 0) {
                    status = '<span class="badge badge-danger">Desativado</span>';
                    acoes = `<a class="dropdown-item" href="#!" onclick="config.method.ativarTaxaDistancia('${e.idtaxaentrega}', 1)">
                                <i class="fas fa-check"></i>&nbsp; <b>Ativar</b>
                            </a>`;
                }

                let temp = config.template.taxadistancia.replace(/\${idtaxaentrega}/g, e.idtaxaentrega)
                    .replace(/\${km}/g, `${e.distancia} km`)
                    .replace(/\${valor}/g, `R$ ${(e.valor).toFixed(2).replace('.', ',')}`)
                    .replace(/\${tempo}/g, tempo)
                    .replace(/\${status}/g, status)
                    .replace(/\${acoes}/g, acoes)

                // adiciona a linha na tabela
                document.querySelector('#listaTaxasDistancia').innerHTML += temp;

            })

        }
        else {
            // nenhum item encontrado
            document.querySelector('#listaTaxasDistancia').innerHTML = `
                <tr>
                    <td colspan="5">Nenhuma taxa cadastrada.</td>
                </tr>
            `;
        }

    },

    // adiciona uma nova taxa por distancia
    adicionarTaxaDistancia: () => {

        let distancia = parseFloat(document.querySelector('#txtTaxaDistanciaKm').value.trim());
        let valor = parseFloat(document.querySelector('#txtTaxaDistanciaValor').value.replace(/\./g, '').replace(',', '.'));
        let tempominimo = parseFloat(document.querySelector('#txtTaxaDistanciaTempoMinimoEntrega').value.trim());
        let tempomaximo = parseFloat(document.querySelector('#txtTaxaDistanciaTempoMaximoEntrega').value.trim());

        if (isNaN(distancia) || distancia <= 0) {
            app.method.mensagem('Informe a distância corretamente (somente números).')
            return;
        }

        if (isNaN(valor) || valor <= 0) {
            app.method.mensagem('Informe o valor da taxa, por favor.')
            return;
        }

        if (isNaN(tempominimo)) {
            tempominimo = '';
        }        

        if (isNaN(tempomaximo)) {
            tempomaximo = '';
        } 

        let dados = {
            distancia: distancia,
            valor: valor,
            tempominimo: tempominimo,
            tempomaximo: tempomaximo
        }

        app.method.loading(true);

        app.method.post('/taxaentregatipo/taxadistancia', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // limpa os campos
                document.querySelector('#txtTaxaDistanciaKm').value = '';
                document.querySelector('#txtTaxaDistanciaValor').value = '';
                document.querySelector('#txtTaxaDistanciaTempoMinimoEntrega').value = '';
                document.querySelector('#txtTaxaDistanciaTempoMaximoEntrega').value = '';

                // carrega a tabela novamente
                config.method.listarTaxaDistancia();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );


    },

    // abre a modal de remover a linha da taxa por disctancia
    abrirModalRemoverTaxaDistancia: (idtaxaentrega) => {

        TAXA_DISTANCIA_SELECIONADA = idtaxaentrega;

        $("#modalRemoverTaxaDistancia").modal('show');

    },

    // remove a taxa por distancia
    removerTaxaDistancia: () => {

        app.method.loading(true);

        var dados = {
            idtaxaentrega: TAXA_DISTANCIA_SELECIONADA
        }

        app.method.post('/taxaentregatipo/taxadistancia/remover', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                $("#modalRemoverTaxaDistancia").modal('hide');

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // carrega a tabela novamente
                config.method.listarTaxaDistancia();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },

    // ativa ou desativa uma taxa de distancia
    ativarTaxaDistancia: (idtaxaentrega, ativar) => {

        app.method.loading(true);

        var dados = {
            idtaxaentrega: idtaxaentrega,
            ativo: ativar
        }

        app.method.post('/taxaentregatipo/taxadistancia/ativar', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // carrega a tabela novamente
                config.method.listarTaxaDistancia();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );

    },


    // ------ TAB FORMAS DE PAGAMENTO ----------

    // obtem as formas de pagamento
    obterConfigFormaPagamento: () => {
        
        app.method.loading(true);

        app.method.get('/formapagamento/painel',
            (response) => {

                app.method.loading(false);
                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }       

                let pix = response.data.filter((e) => { return e.idformapagamento == 1 });
                let dinheiro = response.data.filter((e) => { return e.idformapagamento == 2 });
                let cartaocredito = response.data.filter((e) => { return e.idformapagamento == 3 });
                let cartaodebito = response.data.filter((e) => { return e.idformapagamento == 4 });
                
                config.method.changeOpcaoFormaPagamento(1, 'pix', pix[0].ativo);
                config.method.changeOpcaoFormaPagamento(2, 'dinheiro', dinheiro[0].ativo);
                config.method.changeOpcaoFormaPagamento(3, 'cartaocredito', cartaocredito[0].ativo);
                config.method.changeOpcaoFormaPagamento(4, 'cartaodebito', cartaodebito[0].ativo);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );
        
    },

    // clique na forma de pagamento
    changeOpcaoFormaPagamento: (id, input, isCheck) => {

        let check = document.querySelector('#chkFormaPagamento-' + input).checked;

        if (isCheck != undefined) {
            check = isCheck;
        }

        if (check) {
            document.querySelector('#chkFormaPagamento-' + input).checked = true;

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoFormaPagamento(id, true);
            }

        }   
        else {
            document.querySelector('#chkFormaPagamento-' + input).checked = false;

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoFormaPagamento(id, false);
            }
            
        }

    },

    // salva a opção de forma de pagamento
    salvarOpcaoFormaPagamento: (id, ativar) => {

        let dados = {
            forma: id,
            ativar: ativar ? 1 : 0
        }

        app.method.loading(true);

        app.method.post('/formapagamento/ativar', JSON.stringify(dados),
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                app.method.mensagem(response.message, 'green');

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );
        
    },

}

config.template = {

    taxadistancia: `
        <tr>
            <td>Até \${km}</td>
            <td>\${valor}</td>
            <td>\${tempo}</td>
            <td>\${status}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-white btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu">
                        \${acoes}
                        <a class="dropdown-item color-red" href="#" onclick="config.method.abrirModalRemoverTaxaDistancia('\${idtaxaentrega}')">
                            <i class="fas fa-trash-alt"></i>&nbsp; <b>Remover</b>
                        </a>
                    </div>
                </div>
            </td>
        </tr>
    `

}