var mysql = require('mysql');

module.exports = class AcessoDados {

    async Query(SqlQuery, parametros) {

        try {
            
            var SqlQueryUp = SqlQuery;
            var retorno;
            var connection = mysql.createConnection(global.config.database);

            // percorre os parametros
            if (parametros && parametros != undefined) {

                let p = parametros;

                for (let key in p) {

                    if (p.hasOwnProperty(key)) {

                        let campo = key;
                        let valor = p[key];

                        // valida se é número
                        if (valor != '' && !isNaN(valor)) {
                            // valida se é float ou int
                            if (!Number.isInteger(parseFloat(valor))) // float
                                SqlQueryUp = SqlQueryUp.replace('@' + campo, valor);
                            else // int
                                SqlQueryUp = SqlQueryUp.replace('@' + campo, valor);
                        }
                         // valida se é data (yyyy-MM-dd)
                        else if (valor != '' && valor.split('-').length == 3 && valor.length == 10) //date
                                SqlQueryUp = SqlQueryUp.replace('@' + campo, `'${valor}'`);

                        else {
                            SqlQueryUp = SqlQueryUp.replace('@' + campo, `'${valor}'`);
                        }

                    }

                }

            }

            connection.connect();

            await new Promise((resolve, reject) => {

                connection.query(SqlQueryUp, function (error, results, fields) {
                    if (error) {
                        reject();
                        throw error;
                    }
                    retorno = results;
                    resolve();
                });

            });

            connection.end();
            return retorno;

        } catch (error) {
            console.log(error);
            return error;
        }

    }

}