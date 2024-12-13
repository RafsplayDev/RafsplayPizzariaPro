document.addEventListener("DOMContentLoaded", function (event) {
    home.event.init();
});

var home = {};

var GRAFICO_FORMA_PAGAMENTO = undefined;
var GRAFICO_TIPOS_ENTREGA = undefined;
var GRAFICO_DIAS_SEMANA = undefined;

home.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();

        home.method.obterTotaisFormaPagamento();
        home.method.obterTotaisTiposEntrega();
        home.method.obterTotais();
        home.method.obterTotaisDiasSemana();

        $(".title-home-page").html(`<b>Olá, ${app.method.obterValorSessao('Nome')}</b>`);

    }

}

home.method = {

    // obtem os totais das formas de pagamento (todo o periodo)
    obterTotaisFormaPagamento: () => {

        app.method.loading(true);

        app.method.get('/home/totais/formapagamento',
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                home.method.carregarGraficoFormaPagamento(response.data);

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

    carregarGraficoFormaPagamento: (lista) => {

        if (GRAFICO_FORMA_PAGAMENTO != undefined) {
            GRAFICO_FORMA_PAGAMENTO.destroy();
            GRAFICO_FORMA_PAGAMENTO = undefined;
        }

        // calcula a porcentagem
        let pix = parseFloat((lista[0].pix * 100) / lista[0].total).toFixed(2);
        let dinheiro = parseFloat((lista[0].dinheiro * 100) / lista[0].total).toFixed(2);
        let credito = parseFloat((lista[0].credito * 100) / lista[0].total).toFixed(2);
        let debito = parseFloat((lista[0].debito * 100) / lista[0].total).toFixed(2);

        var TITULOS = ['Pix (%)', 'Dinheiro (%)', 'Crédito (%)', 'Débito (%)'];
        var VALORES = [pix, dinheiro, credito, debito];

        const ctx = document.getElementById('graficoFormaPagamento').getContext("2d");

        GRAFICO_FORMA_PAGAMENTO = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: TITULOS,
                datasets: [
                    {
                        data: VALORES,
                        backgroundColor: ['#be2d32', '#faab19', '#f7a077', '#fff2cc']
                    },
                ],
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
        });

    },

    // obtem os totais de tipos de entrega (todo o periodo)
    obterTotaisTiposEntrega: () => {

        app.method.loading(true);

        app.method.get('/home/totais/tiposentrega',
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                home.method.carregarGraficoTiposEntrega(response.data);

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

    carregarGraficoTiposEntrega: (lista) => {

        if (GRAFICO_TIPOS_ENTREGA != undefined) {
            GRAFICO_TIPOS_ENTREGA.destroy();
            GRAFICO_TIPOS_ENTREGA = undefined;
        }

        // calcula a porcentagem
        let delivery = parseFloat((lista[0].delivery * 100) / lista[0].total).toFixed(2);
        let retirada = parseFloat((lista[0].retirada * 100) / lista[0].total).toFixed(2);

        var TITULOS = ['Delivery (%)', 'Retirada (%)'];
        var VALORES = [delivery, retirada];

        const ctx = document.getElementById('graficoTiposEntrega').getContext("2d");

        GRAFICO_TIPOS_ENTREGA = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: TITULOS,
                datasets: [
                    {
                        data: VALORES,
                        backgroundColor: ['#faab19', '#fff2cc']
                    },
                ],
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
        });

    },

    // obtem os totais dos cards
    obterTotais: () => {

        app.method.loading(true);

        app.method.get('/home/totais/hoje',
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                home.method.atualizarTotais(response.data);

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

    // atualiza os card de totais
    atualizarTotais: (lista) => {

        if (lista.length > 0) {

            let totalFaturado = 0;
            let totalPedido = 0;

            $.each(lista, (i, e) => {
                totalFaturado += e.total;
                totalPedido += e.pedidos;
            })

            $("#lblTotalFaturamento").text(`R$ ${(totalFaturado).toFixed(2).replace('.', ',')}`);
            $("#lblTotalPedidos").text(totalPedido);

        }   
        else {

            // nenhum resgistro encontrado
            $("#lblTotalFaturamento").text('-');
            $("#lblTotalPedidos").text('-');

        }     

    },

    obterTotaisDiasSemana: () => {

        app.method.loading(true);

        app.method.get('/home/totais/diassemana',
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                home.method.carregarGraficoDiasSemana(response.data);

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }
        );

    },

    carregarGraficoDiasSemana: (lista) => {

        if (GRAFICO_DIAS_SEMANA != undefined) {
            GRAFICO_DIAS_SEMANA.destroy();
            GRAFICO_DIAS_SEMANA = undefined;
        }

        var DIAS = {
            '0' : 0,
            '1' : 0,
            '2' : 0,
            '3' : 0,
            '4' : 0,
            '5' : 0,
            '6' : 0
        }

        $.each(lista, (i, e) => {

            let data = new Date(`${e.datafinalizado.split('T')[0]} 00:00:00`);
            let diaSemana = data.getDay();

            DIAS[diaSemana] += 1;

        })

        // calcula a porcentagem
        let domingo = parseFloat((DIAS[0] * 100) / lista.length).toFixed(2);
        let segunda = parseFloat((DIAS[1] * 100) / lista.length).toFixed(2);
        let terca = parseFloat((DIAS[2] * 100) / lista.length).toFixed(2);
        let quarta = parseFloat((DIAS[3] * 100) / lista.length).toFixed(2);
        let quinta = parseFloat((DIAS[4] * 100) / lista.length).toFixed(2);
        let sexta = parseFloat((DIAS[5] * 100) / lista.length).toFixed(2);
        let sabado = parseFloat((DIAS[6] * 100) / lista.length).toFixed(2);

        var TITULOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        var VALORES_PORCENTO = [domingo, segunda, terca, quarta, quinta, sexta, sabado];

        var VALORES_PEDIDOS = [DIAS[0], DIAS[1], DIAS[2], DIAS[3], DIAS[4], DIAS[5], DIAS[6]];

        const ctx = document.getElementById('graficoDiasSemana').getContext("2d");

        GRAFICO_DIAS_SEMANA = new Chart(ctx, {
            type: "bar",
            data: {
                labels: TITULOS,
                datasets: [
                    {
                        label: 'Total de pedidos',
                        data: VALORES_PEDIDOS,
                        borderColor: '#be2d32',
                        backgroundColor: 'rgb(190 45 50 / 10%)',
                        type: 'line',
                        order: 1
                    },
                    {
                        label: 'Porcentagem (%)',
                        data: VALORES_PORCENTO,
                        backgroundColor: '#faab19',
                        order: 0
                    },
                ],
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                callback: (value) => {
                                    return value + ' %';
                                }
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false
                            }
                        },
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                                drawBorder: false
                            }
                        }
                    ]
                },
            },
        });


    },

}