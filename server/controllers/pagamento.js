const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const obterPublicKey = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterPublicKey', 'pagamento');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter a publickey.'
            }
        }
        
    }

    return Object.create({
        obterPublicKey
    })

}

module.exports = Object.assign({ controllers })