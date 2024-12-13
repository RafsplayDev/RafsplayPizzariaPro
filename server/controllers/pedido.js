const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const fetch = require('node-fetch');

// CHAVE API KEY - Geoapify
const key = 'e969175575ef46fbb85cc40d95d4050c';

const controllers = () => {

    // obtem a rota (lat, long) e calcula a taxa do delivery por km
    const calcularTaxaDelivery = async (req) => {
        
        try {

            // primeiro: obtem a lat e long do endereco da empresa
            var ComandoSql = await readCommandSql.restornaStringSql('obterDadosCompletos', 'empresa');
            var empresa = await db.Query(ComandoSql);

            const enderecoEmpresa = `${empresa[0].endereco}, ${empresa[0].numero}, ${empresa[0].bairro}, ${empresa[0].cidade}-${empresa[0].estado}, ${empresa[0].cep}`
            const urlEncodeEmpresa = encodeURI(enderecoEmpresa);

            const urlEmpresa = `https://api.geoapify.com/v1/geocode/search?text=${urlEncodeEmpresa}&apiKey=${key}`;
            const responseEmpresa = await fetch(urlEmpresa);
            const responseJsonEmpresa = await responseEmpresa.json();

            console.log('responseJsonEmpresa', responseJsonEmpresa);

            
            // segundo: obtem a lat e long do endereco do cliente
            const endereco = req.body.endereco;
            const urlEncode = encodeURI(endereco);

            const url = `https://api.geoapify.com/v1/geocode/search?text=${urlEncode}&apiKey=${key}`;
            const response = await fetch(url);
            const responseJson = await response.json();

            console.log('responseJson - cliente', responseJson);


            // Agora calcula a distancia entre a empresa e o cliente
            const distancia = await calcularDistancia(
                responseJson.features[0].properties.lat, 
                responseJson.features[0].properties.lon,
                responseJsonEmpresa.features[0].properties.lat,
                responseJsonEmpresa.features[0].properties.lon
            )

            if (distancia.status == 'error') {
                return distancia;
            }

            // calcula a distancia em KM (a distancia vem em metros da api geoapify)
            const distanciaKm = (distancia.data.features[0].properties.distance) / 1000;

            console.log('distanciaKm', distanciaKm);

            // obtem qual taxa é mais adequada para essa distancia
            var ComandoSqlTaxa = await readCommandSql.restornaStringSql('obterValorTaxaPorKm', 'entrega');
            var taxas = await db.Query(ComandoSqlTaxa, { distancia: distanciaKm });

            if (taxas.length > 0) {
                return {
                    status: 'success',
                    taxa: taxas[0].valor,
                    idtaxa: taxas[0].idtaxaentrega
                }
            }
            else {
                return {
                    status: 'success',
                    taxa: 0,
                    idtaxa: null
                }
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter dados do produto.'
            }
        }
        
    }

    // obtem a distancia entre a loja e o endereço
    const calcularDistancia = async (lat, lon, latLoja, lonLoja) => {

        try {

            const url = `https://api.geoapify.com/v1/routing?waypoints=${latLoja},${lonLoja}|${lat},${lon}&mode=drive&apiKey=${key}`;
            const response = await fetch(url);
            const responseJson = await response.json();

            return {
                status: 'success',
                data: responseJson
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.',
                ex: error
            }
        }

    }

    const salvarPedido = async (req) => {
        
        try {

            var pedido = req.body;

            var idtipoentrega = pedido.entrega ? 1 : 2;

            var total = 0;

            // calcula o total do carrinho

            if (pedido.cart.length > 0) {

                pedido.cart.forEach((e, i) => {

                    let subTotal = 0;

                    if (e.opcionais.length > 0) {
                        for (let index = 0; index < e.opcionais.length; index++) {
                            let element = e.opcionais[index];
                            subTotal += element.valoropcional * e.quantidade;
                        }
                    }
    
                    subTotal += (e.quantidade * e.valor);
                    total += subTotal;

                })

                // valida se tem taxa
                if (pedido.taxaentrega > 0) {
                    total += pedido.taxaentrega
                }

            }

            console.log('TOTAL', total);

            const dados = {
                idpedidostatus: 1,
                idtipoentrega: idtipoentrega,
                idtaxaentrega: pedido.idtaxaentrega || null,
                idformapagamento: pedido.idformapagamento,
                troco: pedido.idformapagamento == 2 ? pedido.troco : null,
                total: total,
                cep: pedido.entrega ? pedido.endereco.cep : null,
                endereco: pedido.entrega ? pedido.endereco.endereco : null,
                numero: pedido.entrega ? pedido.endereco.numero : null,
                bairro: pedido.entrega ? pedido.endereco.bairro : null,
                complemento: pedido.entrega ? pedido.endereco.complemento : null, 
                cidade: pedido.entrega ? pedido.endereco.cidade : null,
                estado: pedido.entrega ? pedido.endereco.estado : null,
                nomecliente: pedido.nomecliente,
                telefonecliente: pedido.telefonecliente
            }

            // primeiro, salva o pedido
            var ComandoSqlAddPedido = await readCommandSql.restornaStringSql('salvarPedido', 'pedido');
            var novoPedido = await db.Query(ComandoSqlAddPedido, dados);

            // se tudo estiver ok, salva as outras informações
            if (novoPedido.insertId != undefined && novoPedido.insertId > 0) {

                var ComandoSqlAddPedidoItem = await readCommandSql.restornaStringSql('salvarPedidoItem', 'pedido');

                // salva os produtos do pedido
                await Promise.all(
                    pedido.cart.map(async (element) => {

                        var novoPedidoItem = await db.Query(ComandoSqlAddPedidoItem, {
                            idpedido: novoPedido.insertId,
                            idproduto: element.idproduto,
                            quantidade: element.quantidade,
                            observacao: element.observacao.length > 0 ? element.observacao : null
                        });

                        // agora salva os opcionais
                        var ComandoSqlAddPedidoItemOpcional = await readCommandSql.restornaStringSql('salvarPedidoItemOpcional', 'pedido');

                        if (novoPedidoItem.insertId != undefined && novoPedidoItem.insertId > 0) {

                            await Promise.all(
                                element.opcionais.map(async (e) => {
                                    await db.Query(ComandoSqlAddPedidoItemOpcional, {
                                        idpedidoitem: novoPedidoItem.insertId,
                                        idopcionalitem: e.idopcionalitem,
                                    });
            
                                })
                            )

                        }

                    })
                )

                var hash = new Date().getTime() + '' + novoPedido.insertId;

                return {
                    status: 'success',
                    message: 'Pedido realizado!',
                    order: hash
                }

            }

            return {
                status: 'error',
                message: 'Falha ao realizar o pedido. Tente novamente.'
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao realizar o pedido. Tente novamente.'
            }
        }
    }

    const obterPedidoPorId = async (req) => {

        try {

            var hash = req.params.idpedido;
            var idpedido = 0;
            var painel = false;

            if (hash.length >= 13) {
                // remove os 13 primeiros numeros aleatorios e pega o ID do pedido correto
                idpedido = hash.toString().substr(13, hash.length);
            }
            else {
                idpedido = hash;
                painel = true;
            }

            var ComandoSql = await readCommandSql.restornaStringSql('obterPedidoPorId', 'pedido');
            var pedido = await db.Query(ComandoSql, { idpedido: idpedido });

            // se for pelo painel, retornamos o carrinho tambem
            if (painel) {

                // busca os itens do carrinho
                var ComandoSqlItens = await readCommandSql.restornaStringSql('obterItensPedido', 'pedido');
                var itens = await db.Query(ComandoSqlItens, { idpedido: idpedido });

                return {
                    status: 'success',
                    data: pedido[0],
                    cart: itens
                }

            }
            else {
                return {
                    status: 'success',
                    data: pedido[0],
                }
            }

        } catch (error) {
             console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os pedidos. Tente novamente.'
            }
        }

    }

    const obterPedidoPorStatus = async (req) => {

        try {

            var idpedidostatus = req.params.idpedidostatus;

            var result = [];

            // se for os Concluidos, retorna somente os 20 últimos pedidos
            if (idpedidostatus == 5) {
                var ComandoSql = await readCommandSql.restornaStringSql('obterPedidosConcluidos', 'pedido');
                result = await db.Query(ComandoSql);
            }
            else {
                var ComandoSql = await readCommandSql.restornaStringSql('obterPedidoPorStatus', 'pedido');
                result = await db.Query(ComandoSql, { idpedidostatus: idpedidostatus });
            }

            // além disso, já obtem os totaus de cada TAB e mando no retorno
            var ComandoSqlTotais = await readCommandSql.restornaStringSql('obterTotaisPedidos', 'pedido');
            var totais = await db.Query(ComandoSqlTotais);

            return {
                status: 'success',
                data: result,
                totais: totais[0]
            }


        } catch (error) {
             console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os pedidos. Tente novamente.'
            }
        }

    }

    const atualizarStatusPedido = async (req) => {

        try {

            if (req.body.tab == 5) {

                // finalizar o pedido

                var ComandoSql = await readCommandSql.restornaStringSql('atualizarStatusPedidoFinalizado', 'pedido');
                await db.Query(ComandoSql, { idpedidostatus: req.body.tab, idpedido: req.body.idpedido });

            }
            else {
                var ComandoSql = await readCommandSql.restornaStringSql('atualizarStatusPedido', 'pedido');
                await db.Query(ComandoSql, { idpedidostatus: req.body.tab, idpedido: req.body.idpedido });
            }

            return {
                status: 'success',
                message: 'Pedido atualizado com sucesso!'
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar o pedido. Tente novamente.'
            }
        }

    }

    const recusarPedido = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('recusarPedido', 'pedido');
            await db.Query(ComandoSql, { idpedido: req.body.idpedido, motivo: req.body.motivo });

            return {
                status: 'success',
                message: 'Pedido recusado.'
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao recusar o pedido. Tente novamente.'
            }
        }

    }

    const historicoPedidos = async (req) => {

        try {

            let datainicio = `${req.body.datainicio} 00:00:00`;
            let datafim = `${req.body.datafim} 23:59:59`; 

            var ComandoSql = await readCommandSql.restornaStringSql('historicoPedidos', 'pedido');
            var result = await db.Query(ComandoSql, {
                datainicio: datainicio,
                datafim: datafim
            });

            return {
                status: 'success',
                data: result
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter o histórico dos pedidos. Tente novamente.'
            }
        }

    }

    return Object.create({
        calcularTaxaDelivery
        , salvarPedido
        , obterPedidoPorId
        , obterPedidoPorStatus
        , atualizarStatusPedido
        , recusarPedido
        , historicoPedidos
    })

}

module.exports = Object.assign({ controllers })