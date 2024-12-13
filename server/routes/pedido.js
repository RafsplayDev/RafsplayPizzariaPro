const ct = require('../controllers/pedido');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    // obtem a lista de produtos para exibir no cardápio
    server.post('/pedido/taxa', async (req, res) => {
        const result = await ct.controllers().calcularTaxaDelivery(req);
        res.send(result);
    })

    // cria um novo pedido
    server.post('/pedido', async (req, res) => {
        const result = await ct.controllers().salvarPedido(req);
        res.send(result);
    })

    server.get('/pedido/:idpedido', async (req, res) => {
        const result = await ct.controllers().obterPedidoPorId(req);
        res.send(result);
    })

    server.get('/pedido/painel/:idpedidostatus', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterPedidoPorStatus(req);
        res.send(result);
    })

    server.post('/pedido/mover', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().atualizarStatusPedido(req);
        res.send(result);
    })

    server.post('/pedido/recusar', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().recusarPedido(req);
        res.send(result);
    })

    server.post('/pedido/historico', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().historicoPedidos(req);
        res.send(result);
    })

}