const ct = require('../controllers/home');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    server.get('/home/totais/formapagamento', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTotaisFormaPagamento(req);
        res.send(result);
    })

    server.get('/home/totais/tiposentrega', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTotaisTiposEntrega(req);
        res.send(result);
    })

    server.get('/home/totais/hoje', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTotaisPedidosHoje(req);
        res.send(result);
    })

    server.get('/home/totais/diassemana', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTotaisDiasSemana(req);
        res.send(result);
    })

}