const ct = require('../controllers/empresa');
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

module.exports = (server) => {

    // obtem as informações da empresa para exibir na página do cardápio
    server.get('/empresa', async (req, res) => {
        const result = await ct.controllers().obterDados(req);
        res.send(result);
    })

    // obtem todas as informações da empresa para exibir na página "Sobre"
    server.get('/empresa/sobre', async (req, res) => {
        const result = await ct.controllers().obterDadosCompletos(req);
        res.send(result);
    })

    // valida se a empresa está aberta ou não
    server.get('/empresa/open', async (req, res) => {
        const result = await ct.controllers().validarEmpresaAberta(req);
        res.send(result);
    })


    // salva todas as informações da empresa na página "Sobre"
    server.post('/empresa/sobre', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarDadosSobre(req);
        res.send(result);
    })

    // salva todas as informações da empresa na página "Endereço"
    server.post('/empresa/endereco', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().salvarDadosEndereco(req);
        res.send(result);
    })

}