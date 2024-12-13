var config = {
    dev: {
        url: 'http://localhost/',
        port: 3000,
        ambiente: 'DEV', 
        database: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'root',
            database: 'rafsplaypizzariapro',
            timezone: 'utc'
        }
    }
}

exports.get = function get(ambiente) {

    if (ambiente.toLowerCase() === 'dev') {
        return config.dev
    }

}
