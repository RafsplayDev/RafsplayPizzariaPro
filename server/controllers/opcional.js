const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const obterOpcionaisProduto = async (req) => {
        
        try {

            const idproduto = req.params.idproduto;

            var ComandoSql = await readCommandSql.restornaStringSql('obterPorProdutoId', 'opcional');
            var result = await db.Query(ComandoSql, { idproduto: idproduto });

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os opcionais.'
            }
        }
        
    }

    const removerOpcionalItem = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('removerOpcionalItem', 'opcional');
            await db.Query(ComandoSql, req.body);

            return {
                status: 'success',
                message: 'Opcional removido com sucesso.'
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover o opcional.'
            }
        }
        
    }
    
     const salvarOpcionaisProduto = async (req) => {
        
        try {

            // valida se é um opcional simples ou seleção de opções
            if (req.body.simples) {

                // OPCIONAL SIMPLES

                // valida se o opcional simples já existe no produto
                var ComandoSqlSelect = await readCommandSql.restornaStringSql('obterProdutoOpcionalPorOpcional', 'opcional');
                var result = await db.Query(ComandoSqlSelect, { idproduto: req.body.idproduto });

                if (result === undefined || result.length === 0) {

                    // Não existe um opcional simples no produto

                    var ComandoSqlAddOpcional = await readCommandSql.restornaStringSql('adicionarNovoOpcional', 'opcional');
                    var novoOpcional = await db.Query(ComandoSqlAddOpcional, {
                        nome: 'Opcionais',
                        tiposimples: 1,
                        minimo: 0,
                        maximo: 0
                    });

                    if (novoOpcional.insertId !== undefined && novoOpcional.insertId > 0) {

                        req.body.idopcional = novoOpcional.insertId;

                        // adiciona o opcional item
                        var ComandoSqlAddItem = await readCommandSql.restornaStringSql('adicionarOpcionalItem', 'opcional');
                        await db.Query(ComandoSqlAddItem, req.body);

                        // vincula o opcional no produto
                        var ComandoSqlAddOpcionalProduto = await readCommandSql.restornaStringSql('adicionarOpcionalProduto', 'opcional');
                        await db.Query(ComandoSqlAddOpcionalProduto, {
                            idproduto: req.body.idproduto,
                            idopcional: novoOpcional.insertId
                        });

                        return {
                            status: 'success',
                            message: 'Opcional adicionado com sucesso.'
                        }

                    }
                    else {
                        return {
                            status: 'error',
                            message: 'Falha ao adicionar opcional.'
                        }
                    }

                }
                else {

                    // Já existe um opcional cadastrado, adiciona o novo
                    req.body.idopcional = result[0].idopcional;

                    // adiciona o opcional item
                    var ComandoSqlAddItem = await readCommandSql.restornaStringSql('adicionarOpcionalItem', 'opcional');
                    var result = await db.Query(ComandoSqlAddItem, req.body);

                    return {
                        status: 'success',
                        message: 'Opcional adicionado com sucesso.'
                    }

                }

            }
            else {

                // SELEÇÃO DE OPÇÕES 

                // adicona o novo opcional
                var ComandoSqlAddOpcional = await readCommandSql.restornaStringSql('adicionarNovoOpcional', 'opcional');
                var novoOpcional = await db.Query(ComandoSqlAddOpcional, {
                    nome: req.body.titulo,
                    tiposimples: 0,
                    minimo: req.body.minimoOpcao,
                    maximo: req.body.maximoOpcao
                });

                if (novoOpcional.insertId !== undefined && novoOpcional.insertId > 0) {

                    // vincula o opcional no produto
                    var ComandoSqlAddOpcionalProduto = await readCommandSql.restornaStringSql('adicionarOpcionalProduto', 'opcional');
                    await db.Query(ComandoSqlAddOpcionalProduto, {
                        idproduto: req.body.idproduto,
                        idopcional: novoOpcional.insertId
                    });

                    var ComandoSqlAddItem = await readCommandSql.restornaStringSql('adicionarOpcionalItem', 'opcional');

                    const sleep = m => new Promise(r => setTimeout(r, m));
        
                    await Promise.all(
                        req.body.lista.map(async (element) => {
                            element.idopcional = novoOpcional.insertId;
                            await db.Query(ComandoSqlAddItem, element);
                            await sleep(500);
                        })
                    )                    

                    return {
                        status: 'success',
                        message: 'Opcionais adicionados com sucesso.'
                    }

                }
                else {
                    return {
                        status: 'error',
                        message: 'Falha ao adicionar opcionais.'
                    }
                }

            }
            
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao salvar opcional.'
            }
        }
        
    }

    return Object.create({
        obterOpcionaisProduto
        , removerOpcionalItem
        , salvarOpcionaisProduto
    })

}

module.exports = Object.assign({ controllers })