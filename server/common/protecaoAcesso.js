var jwt = require('jsonwebtoken');
var SchemaObject = require('node-schema-object');

var UsuarioAcessoToken = new SchemaObject({ tokenAcesso: String }, 
    {
        methods: {

            gerarTokenAcesso(dados) {

                try {
                    return jwt.sign({ 'Email': dados.email, 'IdEmpresa': dados.idempresa, 'Nome': dados.nome }, 'Token', { expiresIn: '1d' })
                } catch (error) {
                    console.log(error);
                    throw error
                }

            },

            verificaTokenAcesso(req, res, next) {

                var headerTokenAcesso = req.headers["authorization"];

                if (typeof headerTokenAcesso != 'undefined') {

                    try {
                        jwt.verify(headerTokenAcesso, 'Token');
                        next();
                    } catch (error) {
                        res.send(401);
                    }

                }
                else {
                    res.send(401);
                }

            },

            retornaCodigoTokenAcesso(valor, req) {

                var headerTokenAcesso = req.headers["authorization"];
                var decoded = jwt.decode(headerTokenAcesso, { complete: true });

                if (valor === "IdEmpresa") {
                    return decoded.payload.IdEmpresa;
                }

                if (valor === "Email") {
                    return decoded.payload.Email;
                }

                if (valor === "Nome") {
                    return decoded.payload.Nome;
                }

            }

        }
    }    
);

module.exports = UsuarioAcessoToken;