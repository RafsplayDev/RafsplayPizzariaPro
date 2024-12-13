const ct = require('../controllers/formapagamento');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    // obtem todas as formas de pagamento ativas para exibir nos detalhes da empresa
    server.get('/formapagamento', async (req, res) => {
        const result = await ct.controllers().obterFormasPagamentoAtivas(req);
        res.send(result);
    })

    // obtem todas as formas de pagamento
    server.get('/formapagamento/painel', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTodasFormasPagamento(req);
        res.send(result);
    })

    // ativa ou desativa uma forma de pagamento
    server.post('/formapagamento/ativar', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().ativarFormaPagamento(req);
        res.send(result);
    })

}