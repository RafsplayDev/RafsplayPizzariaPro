const ct = require('../controllers/taxaentrega');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    // obtem os tipos de taxas de entrega
    server.get('/taxaentregatipo', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTaxaEntregaTipo(req);
        res.send(result);
    })

    // ativa ou desativa um tipo de taxa de entrega
    server.post('/taxaentregatipo/ativar', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().ativarTaxaEntregaTipo(req);
        res.send(result);
    })

    // obtem as config da taxa unica
    server.get('/taxaentregatipo/taxaunica', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTaxaUnica(req);
        res.send(result);
    })

    // salva as config da taxa unica
    server.post('/taxaentregatipo/taxaunica', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarTaxaUnica(req);
        res.send(result);
    })


    // obtem as config da taxa por ditancia
    server.get('/taxaentregatipo/taxadistancia', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTaxaDistancia(req);
        res.send(result);
    })

    // adiciona a config de taxa por distancia
    server.post('/taxaentregatipo/taxadistancia', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarTaxaDistancia(req);
        res.send(result);
    })

    // remove a config de taxa por distancia
    server.post('/taxaentregatipo/taxadistancia/remover', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().removerTaxaDistancia(req);
        res.send(result);
    })

    // ativa ou desativa a config de taxa por distancia
    server.post('/taxaentregatipo/taxadistancia/ativar', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().ativarTaxaDistancia(req);
        res.send(result);
    })


}