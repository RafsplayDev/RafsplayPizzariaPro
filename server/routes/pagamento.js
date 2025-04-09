const ct = require('../controllers/pagamento');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    server.get('/pagamento/publickey', async (req, res) => {
        const result = await ct.controllers().obterPublicKey(req);
        res.send(result);
    })
    
}