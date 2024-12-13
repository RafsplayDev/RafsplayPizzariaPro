const ct = require('../controllers/opcional');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    server.get('/opcional/produto/:idproduto', async (req, res) => {
        const result = await ct.controllers().obterOpcionaisProduto(req);
        res.send(result);
    })

    server.post('/opcional/item/remover', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().removerOpcionalItem(req);
        res.send(result);
    })

    server.post('/opcional/produto', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarOpcionaisProduto(req);
        res.send(result);
    })

}