const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const controllers = () => {

    const obterTiposEntrega = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterTiposEntrega', 'entrega');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os tipos de entrega.'
            }
        }
        
    }

    const ativarTipoEntrega = async (req) => {
        
        try {

            let idtipoentrega = req.body.tipo;
            let ativo = req.body.ativar;

            var ComandoSql = await readCommandSql.restornaStringSql('ativarTipoEntrega', 'entrega');
            var result = await db.Query(ComandoSql, { idtipoentrega: idtipoentrega, ativo: ativo });

            return {
                status: 'success',
                message: 'Opção atualizada.'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar opção.'
            }
        }
        
    }

    const salvarTempoTipoEntrega = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('salvarTempoTipoEntrega', 'entrega');
            var result = await db.Query(ComandoSql, req.body);

            return {
                status: 'success',
                message: 'Tempo atualizado.'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar o tempo.'
            }
        }
        
    }

    const obterTaxaEntregaAtiva = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterTaxaEntregaAtiva', 'entrega');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter a taxa de entrega.'
            }
        }

    }

    return Object.create({
        obterTiposEntrega
        , ativarTipoEntrega
        , salvarTempoTipoEntrega
        , obterTaxaEntregaAtiva
    })

}

module.exports = Object.assign({ controllers })