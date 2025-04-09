const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const controllers = () => {

    const obterFormasPagamentoAtivas = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterFormasPagamentoAtivas', 'formapagamento');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter as formas de pagamento.'
            }
        }
        
    }

    const obterTodasFormasPagamento = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterTodasFormasPagamento', 'formapagamento');
            var result = await db.Query(ComandoSql);

            var ComandoSqlConfig = await readCommandSql.restornaStringSql('obterConfigMP', 'formapagamento');
            var resultConfig = await db.Query(ComandoSqlConfig);

            return {
                status: 'success',
                data: result,
                config: resultConfig[0]
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter as formas de pagamento.'
            }
        }
        
    }

    const ativarFormaPagamento = async (req) => {
        
        try {

            let idformapagamento = req.body.forma;
            let ativo = req.body.ativar;

            var ComandoSql = await readCommandSql.restornaStringSql('ativarFormaPagamento', 'formapagamento');
            await db.Query(ComandoSql, { idformapagamento: idformapagamento, ativo: ativo });

            return {
                status: 'success',
                message: 'Forma de pagamento atualizada.'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar a forma de pagamento.'
            }
        }
        
    }

    const salvarConfigMP = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('salvarConfigMP', 'formapagamento');
            await db.Query(ComandoSql, req.body);

            return {
                status: 'success',
                message: 'Configuração atualizada.'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar a configuração.'
            }
        }
        
    }


    return Object.create({
        obterFormasPagamentoAtivas
        , obterTodasFormasPagamento
        , ativarFormaPagamento
        , salvarConfigMP
    })

}

module.exports = Object.assign({ controllers })

