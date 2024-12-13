const { server, restify, config } = require('./server/server');

server.get('/*', restify.plugins.serveStatic({
    directory: './client',
    default: 'index.html'
}));

server.listen(config.port, () => {
    console.log(`AMBIENTE: ${config.ambiente} URL: ${config.url} PORTA: ${config.port}`);
});

