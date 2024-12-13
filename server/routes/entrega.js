const ct = require('../controllers/entrega');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    // obtem todas as informações dos tipos de entrega
    server.get('/entrega/tipo', async (req, res) => {
        const result = await ct.controllers().obterTiposEntrega(req);
        res.send(result);
    })

    // salva o tempo do tipo da entrega (minimo e máximo)
    server.post('/entrega/tipo', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarTempoTipoEntrega(req);
        res.send(result);
    })

    // ativa ou inativa o tipo de entrega
    server.post('/entrega/tipo/ativar', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().ativarTipoEntrega(req);
        res.send(result);
    })

    // obtem a taxa de entrega ativa
    server.get('/entrega/taxa', async (req, res) => {
        const result = await ct.controllers().obterTaxaEntregaAtiva(req);
        res.send(result);
    })

}