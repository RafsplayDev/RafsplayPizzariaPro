document.addEventListener("DOMContentLoaded", function (event) {
    app.event.init(true);
    cardapio.event.init();
});

var cardapio = {}

cardapio.event = {

    init: () => {

        cardapio.method.obterDadosEmpresa();
        cardapio.method.obterCategorias();
        cardapio.method.obterItensCarrinho();

    }

}


cardapio.method = {

    // obtem os dados da empresa
    obterDadosEmpresa: () => {

        app.method.get('/empresa',
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                document.querySelector("#lblNomeEmpresa").innerText = response.data[0].nome;

                if (response.data[0].logotipo != null) {
                    document.querySelector('#imgLogoEmpresa').style.backgroundImage = `url('/public/images/empresa/${response.data[0].logotipo}')`;
                    document.querySelector('#imgLogoEmpresa').style.backgroundSize = 'cover';
                }
                else {
                    document.querySelector('#imgLogoEmpresa').remove();
                }

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }, true
        );

    },

    // obtem a lista decategorias
    obterCategorias: () => {

        app.method.get('/categoria',
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                cardapio.method.carregarCategorias(response.data);
               
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }, true
        );

    },

    // carregar as categorias na tela
    carregarCategorias: (list) => {

        if (list.length > 0) {

            // limpa o menu das categorias
            document.querySelector('#listaCategorias').innerHTML = '';

            // limpa o cardápio
            document.querySelector('#listaItensCardapio').innerHTML = '';

            list.forEach((e, i) => {

                let active = '';

                let iconeCategoria = '';
                let _icone = ICONES.filter((icone) => { return icone.name === e.icone });

                if (_icone.length > 0) {
                    iconeCategoria = _icone[0].icon;
                }

                // seta ativo a primeira categoria
                if (i == 0) {
                    active = 'active';
                }

                let temp = cardapio.templates.categoria.replace(/\${idcategoria}/g, e.idcategoria)
                    .replace(/\${active}/g, active)
                    .replace(/\${icone}/g, iconeCategoria)
                    .replace(/\${nome}/g, e.nome)

                // adiciona a categoria no menu
                document.querySelector('#listaCategorias').innerHTML += temp;

                let tempHeaderCategoria = cardapio.templates.headerCategoria.replace(/\${idcategoria}/g, e.idcategoria)
                    .replace(/\${nome}/g, e.nome)

                // adiciona a categoria no cardápio
                document.querySelector('#listaItensCardapio').innerHTML += tempHeaderCategoria;

                // No último item, obtem os produtos
                if (list.length == (i + 1)) {

                    cardapio.method.obterProdutos();

                    // inicia a validação do scroll para setar a categoria ativa
                    document.addEventListener("scroll", (event) => {
                        cardapio.method.validarCategoriaScroll();
                    })

                }

            })

        }

    },

    // obtem a lista de produtos
    obterProdutos: () => {

        app.method.loading(true);

        app.method.get('/produto',
            (response) => {

                console.log(response)
                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message)
                    return;
                }

                cardapio.method.carregarProdutos(response.data);
               
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }, true
        );

    },

    // carrega os produtos na tela
    carregarProdutos: (list) => {

        if (list.length > 0) {

            list.forEach((e, i) => {

                let _imagem = e.imagem;

                if (e.imagem == null) {
                    _imagem = 'default.jpg'
                }

                let temp = cardapio.templates.produto.replace(/\${idproduto}/g, e.idproduto)
                    .replace(/\${nome}/g, e.nome)
                    .replace(/\${imagem}/g, _imagem)
                    .replace(/\${descricao}/g, e.descricao)
                    .replace(/\${valor}/g, e.valor.toFixed(2).replace('.', ','))
                    

                // adiciona o produto na categoria
                document.querySelector('#categoria-header-' + e.idcategoria).innerHTML += temp;                

            })

        }

    },

    // método para abrir os detalhes do produto
    abrirProduto: (id) => {
        window.location.href = `/item.html?p=${id}`;
    },

    // valida o scroll para ativar a cetegoria
    validarCategoriaScroll: () => {

        var categorias = document.querySelector('#listaItensCardapio').getElementsByClassName('container-group');

        for (let index = 0; index < categorias.length; index++) {

            // pega o id da categoria atual
            let element = categorias[index].getAttribute('id');

            let docViewTop = window.scrollY; // valor do scroll da opagina atualmente
            let elemTop = document.querySelector('#' + element).offsetTop; // posição do header da categoria em relação ao top
            let top = (elemTop - (docViewTop + 100)) * -1; // Faz a conta para validar se está no topo. o 100 é o valor do Menu superior
            let id = element.split('categoria-header-')[1]; // pega o ID da categoria

            // se for > 0, quer dizer que está no topo. Ativa a categoria
            if (top > 0) {
                Array.from(document.querySelectorAll('.item-categoria')).forEach(e => e.classList.remove('active'))
                document.querySelector('#categoria-' + id).classList.add('active');
            }
            
        }

    },

    // clique na categoria
    selecionarCategoria: (id) => {

        Array.from(document.querySelectorAll('.item-categoria')).forEach(e => e.classList.remove('active'))
        document.querySelector('#categoria-' + id).classList.add('active');

        // método para scrolar a página ate o elemento
        window.scrollTo({
            top: document.querySelector('#categoria-header-' + id).offsetTop,
            behavior: 'smooth'
        })

    },

    // valida quantos itens tem no carrinho e exibe o icone
    obterItensCarrinho: () => {

        let carrinho = app.method.obterValorSessao('cart');

        if (carrinho != undefined) {

            let cart = JSON.parse(carrinho);

            if (cart.itens.length > 0) {
                document.querySelector("#icone-carrinho-vazio").classList.add('hidden');
                document.querySelector("#total-carrinho").classList.remove('hidden');
                document.querySelector("#total-carrinho").innerText = cart.itens.length;
            }
            else {
                document.querySelector("#icone-carrinho-vazio").classList.remove('hidden');
                document.querySelector("#total-carrinho").classList.add('hidden');
                document.querySelector("#total-carrinho").innerText = 0;
            }

        }
        else {
            document.querySelector("#icone-carrinho-vazio").classList.remove('hidden');
            document.querySelector("#total-carrinho").classList.add('hidden');
            document.querySelector("#total-carrinho").innerText = 0;
        }

    },

}

cardapio.templates = {

    categoria: `
        <a href="#!" id="categoria-\${idcategoria}" class="item-categoria btn btn-white btn-sm mb-3 me-3 \${active}" onclick="cardapio.method.selecionarCategoria('\${idcategoria}')">
            \${icone}&nbsp; \${nome}
        </a>

    `,

    headerCategoria: `
        <div class="container-group mb-5" id="categoria-header-\${idcategoria}">
            <p class="title-categoria"><b>\${nome}</b></p>
        </div>
    `,

    produto: `
        <div class="card mb-2 item-cardapio" onclick="cardapio.method.abrirProduto('\${idproduto}')">
            <div class="d-flex">
                <div class="container-img-produto" style="background-image: url('/public/images/\${imagem}'); background-size: cover;"></div>
                <div class="infos-produto">
                    <p class="name"><b>\${nome}</b></p>
                    <p class="description">\${descricao}</p>
                    <p class="price"><b>R$ \${valor}</b></p>
                </div>
            </div>
        </div>
    `

}