const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const controllers = () => {

    const obterTotaisFormaPagamento = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterTotaisFormaPagamento', 'home');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os totais.'
            }
        }

    }

    const obterTotaisTiposEntrega = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterTotaisTiposEntrega', 'home');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os totais.'
            }
        }

    }

    const obterTotaisPedidosHoje = async (req) => {

        try {

            // pega a data atual
            let data_teste = new Date();
            let dia = data_teste.getDate();
            let mes = data_teste.getMonth() + 1;
            let ano = data_teste.getFullYear();

            if (dia < 10) dia = '0' + dia;
            if (mes < 10) mes = '0' + mes;

            let data_final = `${ano}-${mes}-${dia}`;

            let datainicio = `${data_final} 00:00:00`;
            let datafim = `${data_final} 23:59:59`;

            var ComandoSql = await readCommandSql.restornaStringSql('obterTotaisPedidosHoje', 'home');
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
                message: 'Falha ao obter os totais.'
            }
        }

    }

    const obterTotaisDiasSemana = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterTotaisDiasSemana', 'home');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os totais.'
            }
        }

    }

    return Object.create({
        obterTotaisFormaPagamento
        , obterTotaisTiposEntrega
        , obterTotaisPedidosHoje
        , obterTotaisDiasSemana
    })

}

module.exports = Object.assign({ controllers })