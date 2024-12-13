const ct = require('../controllers/faturamento');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    server.post('/faturamento/filtrar', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().filtrarFaturamento(req);
        res.send(result);
    })

}