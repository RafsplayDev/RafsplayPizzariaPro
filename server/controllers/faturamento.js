const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const filtrarFaturamento = async (req) => {

        try {

            let datainicio = `${req.body.datainicio} 00:00:00`;
            let datafim = `${req.body.datafim} 23:59:59`;
            let categoria = req.body.categoria == 0 ? '1, 2' : req.body.categoria;


            var ComandoSql = await readCommandSql.restornaStringSql('filtrarFaturamento', 'faturamento');

            // faz o replace do filtro
            ComandoSql = ComandoSql.replace('@filtroCategoria', `AND idtipoentrega IN(${categoria})`);
            
            var result = await db.Query(ComandoSql, {
                datainicio: datainicio,
                datafim: datafim
            });

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter o faturamento.'
            }
        }

    }


    return Object.create({
        filtrarFaturamento
    })

}

module.exports = Object.assign({ controllers })