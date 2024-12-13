const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const controllers = () => {

    const obterHorarios = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterHorarios', 'horario');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os horários da empresa.'
            }
        }

    }

    const salvarHorarios = async (req) => {

        try {

            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            var ComandoSqlRemove = await readCommandSql.restornaStringSql('removerHorarios', 'horario');
            await db.Query(ComandoSqlRemove, { idempresa: _empresaId });

            var ComandoSql = await readCommandSql.restornaStringSql('salvarHorario', 'horario');

            const sleep = m => new Promise(r => setTimeout(r, m));

            await Promise.all(
                req.body.map(async (element) => {
                    element.idempresa = _empresaId;
                    await db.Query(ComandoSql, element);
                    await sleep(500);
                })
            )

            return {
                status: 'success',
                message: 'Horários atualizados com sucesso!'
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar os horários da empresa.'
            }
        }

    }

    return Object.create({
        obterHorarios
        , salvarHorarios
    })

}

module.exports = Object.assign({ controllers })