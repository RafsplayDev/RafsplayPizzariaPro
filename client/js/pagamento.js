document.addEventListener("DOMContentLoaded", function (event) {
    pagamento.event.init();
});

var pagamento = {}
var SUB_ORDER = null;
var TOTAL_CARRINHO = 0;

var MP = null; // variavel do mercado pago
var BRICKS_BUILDER = null; // varial do mercado pago (container bricks)

pagamento.event = {

    init: () => {

        app.method.loading(true);

        // obter a suborder
        let subOrderAtual = app.method.obterValorSessao('sub-order');
        SUB_ORDER = subOrderAtual !== undefined ? JSON.parse(subOrderAtual) : null;

        if (SUB_ORDER === null) {
            window.location.href = '/index.html';
        }

        // obter o total do carrinho
        pagamento.method.obterTotalCarrinho(pagamento.method.obterDadosMP);

        // obter os dados do MP (publickKey)

    },

}

pagamento.method = {

    obterTotalCarrinho: (callback) => {

        let total = 0;

        if (SUB_ORDER.cart.length > 0) {


            SUB_ORDER.cart.forEach((e, i) => {

                let subTotal = 0;

                if (e.opcionais.length > 0) {
                    // percorre a lista de opcionais
                    for (let index = 0; index < e.opcionais.length; index++) {
                        let element = e.opcionais[index];
                        subTotal += element.valoropcional * e.quantidade;
                    }
                }

                subTotal += (e.quantidade * e.valor);
                total += subTotal;

            });

            // validar taxa entrega
            if (SUB_ORDER.taxaentrega > 0) { 
                total += SUB_ORDER.taxaentrega;
            }

        }

        TOTAL_CARRINHO = total;
        document.getElementById('lblTotalCarrinho').innerText = `R$ ${(total).toFixed(2).replace('.', ',')}`;
        callback();

    },

    // obtem os dados do MP da empresa
    obterDadosMP: () => {

        app.method.get('/pagamento/publickey',
            (response) => {

                console.log('response', response);
                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;
                }

                if (response.data[0].publickey === null || response.data[0].publickey === '') {
                    app.method.mensagem('Pagamento online não habilitado para esta empresa');
                    setTimeout(() => {
                        window.location.href = '/index.html'
                    }, 2500)
                    return;
                }

                MP = new MercadoPago(response.data[0].publickey, {
                    locale: 'pt'
                });

                BRICKS_BUILDER = MP.bricks();

                pagamento.method.renderPaymentBrick();
                                
            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);
            }, true
        );

    },

    // renderiza as 'Formas de Pagamento' do MP
    renderPaymentBrick: async () => {

        const settings = {
            initialization: {
              amount: TOTAL_CARRINHO,
              payer: {
                firstName: SUB_ORDER.nomecliente,
                lastName: "",
                email: "",
              },
            },
            customization: {
              visual: {
                style: {
                  theme: "default",
                  customVariables: {
                    baseColor: '#ffbf00',
                    baseColorSecondVariant: '#ffda6f',
                    buttonTextColor: '#000000'
                  }
                },
              },
              paymentMethods: {
                creditCard: "all",
                bankTransfer: "all",
                atm: "all",
                maxInstallments: 1
              },
            },
            callbacks: {
              onReady: () => {
                
              },
              onSubmit: ({ selectedPaymentMethod, formData }) => {
                // callback chamado quando há click no botão de envio de dados

                let dados = {
                    formData: formData,
                    selectedPaymentMethod: selectedPaymentMethod
                }

                pagamento.method.gerarPagamento(dados)
                
              },
              onError: (error) => {
                // callback chamado para todos os casos de erro do Brick
                console.error(error);
                app.method.mensagem(error);
              },
            },
        };

        window.paymentBrickController = await BRICKS_BUILDER.create(
            "payment",
            "paymentBrick_container",
            settings
        );

    },

    gerarPagamento: (dados) => {

        

    },

}
