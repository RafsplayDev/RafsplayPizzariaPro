global.config = require('./config').get('dev');

const restify = require("restify");
const path = require("path");
const recursiveReaddir = require("recursive-readdir")

// Cria o servidor
const server = restify.createServer({
    name: 'Delivery',
    version: '1.0.0'
});

// Adiciona as extensões do restify para o funcionamento do JSON nas requsições
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.urlEncodedBodyParser());

// Adiciona todas as Rotas dentro da inicialização do server (para escutar as rotas na pasta "routes")
const pathFiles = path.resolve(path.resolve('./').concat('/server/routes'));

recursiveReaddir(pathFiles, ['!*.js'], (err, files) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    files.forEach(element => { require(element)(server) })
});

// Utilizado para não dar problema com requisições no Chrome (CORS)
server.use(
    function nocache(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Pragma", "no-cache");
        next();
    }
)

server.get('/public/*', restify.plugins.serveStatic({
    directory: __dirname
}))

// Modifica o array de erro e mostra pro usuário uma mensagem personalizada
server.on('restifyError', function(req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return {
            Erro: 'Página não encontrada :/'
        }
    };
    return callback();
});

module.exports = Object.assign({ server, restify, config })