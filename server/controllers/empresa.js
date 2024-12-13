const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const controllers = () => {

    const obterDados = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterDados', 'empresa');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter dados da empresa.'
            }
        }
        
    }

    const obterDadosCompletos = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterDadosCompletos', 'empresa');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter dados da empresa.'
            }
        }
        
    }

    const validarEmpresaAberta = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('obterHorarios', 'horario');
            var horarios = await db.Query(ComandoSql);

            if (horarios != undefined && horarios.length > 0) {

                let dataAtual = new Date();
                let diaSemana = dataAtual.getDay();
                let listaDias = [];
                
                horarios.forEach((e, i) => {

                    if (e.diainicio < e.diafim) {
                        for (let dia = e.diainicio; dia <= e.diafim; dia++) {
                            listaDias.push({
                                diaSemana: dia,
                                iniciohorarioum: e.iniciohorarioum,
                                iniciohorariodois: e.iniciohorariodois,
                                fimhorarioum: e.fimhorarioum,
                                fimhorariodois: e.fimhorariodois
                            });
                        }
                    }
                    else if (e.diainicio > e.diafim) {
                        for (let dia = e.diafim; dia <= e.diainicio; dia--) {
                            listaDias.push({
                                diaSemana: dia,
                                iniciohorarioum: e.iniciohorarioum,
                                iniciohorariodois: e.iniciohorariodois,
                                fimhorarioum: e.fimhorarioum,
                                fimhorariodois: e.fimhorariodois
                            });
                        }
                    }
                    else if (e.diainicio == e.diafim) {
                        listaDias.push({
                            diaSemana: e.diainicio,
                            iniciohorarioum: e.iniciohorarioum,
                            iniciohorariodois: e.iniciohorariodois,
                            fimhorarioum: e.fimhorarioum,
                            fimhorariodois: e.fimhorariodois
                        });
                    }

                })

                let existe = listaDias.find((elem) => { return elem.diaSemana == diaSemana });

                if (existe != undefined) {

                    // faz a validação do horario
                    let horarioAtual = dataAtual.getTime();
                    let diaAtual = dataAtual.getDate();
                    let mesAtual = dataAtual.getMonth() + 1;
                    let anoAtual = dataAtual.getFullYear();

                    if (diaAtual < 10) { diaAtual = '0' + diaAtual };
                    if (mesAtual < 10) { mesAtual = '0' + mesAtual };

                    let iniciohorarioum = existe.iniciohorarioum != null ? new Date(`${anoAtual}-${mesAtual}-${diaAtual} ${existe.iniciohorarioum}:00`).getTime() : null;
                    let iniciohorariodois = existe.iniciohorariodois != null ? new Date(`${anoAtual}-${mesAtual}-${diaAtual} ${existe.iniciohorariodois}:00`).getTime() : null;
                    let fimhorarioum = existe.fimhorarioum != null ? new Date(`${anoAtual}-${mesAtual}-${diaAtual} ${existe.fimhorarioum}:00`).getTime() : null;
                    let fimhorariodois = existe.fimhorariodois != null ? new Date(`${anoAtual}-${mesAtual}-${diaAtual} ${existe.fimhorariodois}:00`).getTime() : null;

                    // se existe o horario, valida se está aberto
                    if (iniciohorarioum != null && fimhorarioum != null) {

                        if (horarioAtual >= iniciohorarioum && horarioAtual <= fimhorarioum) {
                            return {
                                status: 'success',
                                data: true
                            }
                        }

                    }

                    if (iniciohorariodois != null && fimhorariodois != null) {

                        if (horarioAtual >= iniciohorariodois && horarioAtual <= fimhorariodois) {
                            return {
                                status: 'success',
                                data: true
                            }
                        }

                    }

                    return {
                        status: 'error',
                        message: 'Estabelecimento fechado.',
                        data: false
                    }

                }
                else {
                    return {
                        status: 'error',
                        message: 'Estabelecimento fechado.',
                        data: false
                    }
                }

            }
            else {
                return {
                    status: 'error',
                    message: 'Estabelecimento fechado.',
                    data: false
                }
            }            
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao validar horarios.',
                data: false
            }
        }
        
    }

    const salvarDadosSobre = async (req) => {
        
        try {

            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            req.body.idempresa = _empresaId;

            var ComandoSql = await readCommandSql.restornaStringSql('salvarDadosSobre', 'empresa');
            var result = await db.Query(ComandoSql, req.body);

            return {
                status: 'success',
                message: 'Dados atualizados com sucesso!'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar dados. Tente novamente.'
            }
        }
        
    }

    const salvarDadosEndereco = async (req) => {
        
        try {

            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            req.body.idempresa = _empresaId;

            var ComandoSql = await readCommandSql.restornaStringSql('salvarDadosEndereco', 'empresa');
            var result = await db.Query(ComandoSql, req.body);

            return {
                status: 'success',
                message: 'Dados atualizados com sucesso!'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao atualizar dados. Tente novamente.'
            }
        }
        
    }

    return Object.create({
        obterDados
        , obterDadosCompletos
        , validarEmpresaAberta
        , salvarDadosSobre
        , salvarDadosEndereco
    })

}

module.exports = Object.assign({ controllers })