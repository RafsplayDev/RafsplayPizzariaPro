const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const ctImagem = require('../controllers/imagem');

const controllers = () => {

    const listarTodas = async (req) => {

        try {

            var ComandoSql = await readCommandSql.restornaStringSql('listarTodas', 'categoria');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter as categorias.'
            }
        }

    }

    const salvarDados = async (req) => {

        try {

            var idcategoria = req.body.idcategoria;

            if (idcategoria > 0) {

                // atualizar a categoria
                var ComandoSql = await readCommandSql.restornaStringSql('atualizarCategoria', 'categoria');
                var result = await db.Query(ComandoSql, req.body);

                return {
                    status: 'success',
                    message: "Categoria atualizada com sucesso!"
                }

            }
            else {

                // inserir uma nova categoria
                var ComandoSql = await readCommandSql.restornaStringSql('adicionarCategoria', 'categoria');
                var result = await db.Query(ComandoSql, req.body);

                return {
                    status: 'success',
                    message: "Categoria adicionada com sucesso!"
                }

            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao salvar categoria. Tente novamente.'
            }
        }

    }

    const ordenarCategorias = async (req) => {

        try {

            var lista = req.body;

            const promises = await lista.map(async elem => {
                new Promise(async (resolve, reject) => {

                    var ComandoSql = await readCommandSql.restornaStringSql('atualizarOrdemCategoria', 'categoria');
                    await db.Query(ComandoSql, elem);

                    resolve(elem);

                })
            })

            await Promise.all(promises);

            return {
                status: 'success',
                message: "Categorias ordenadas com sucesso."
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao ordenar categorias. Tente novamente.'
            }
        }

    }

    const duplicarCategoria = async (req) => {

        try {

            var idcategoria = req.body.idcategoria;

            // primeiro, obtem todos os produtos da categoria

            var ComandoSqlProdutos = await readCommandSql.restornaStringSql('obterPorCategoriaIdSemOrdenacao', 'produto');
            var produtos_categoria = await db.Query(ComandoSqlProdutos, { idcategoria: idcategoria });

            // depois, obtem as informações da categoria

            var ComandoSqlCategoria = await readCommandSql.restornaStringSql('obterPorId', 'categoria');
            var dados_categoria = await db.Query(ComandoSqlCategoria, { idcategoria: idcategoria });

            if (dados_categoria.length == 0) {
                return {
                    status: 'error',
                    message: 'Falha ao duplicar a categoria. Tente novamente.'
                }
            }

            // altera o nome para "Cópia" e insere a nova categoria no banco

            dados_categoria[0].nome = dados_categoria[0].nome + ' - Cópia';

            var ComandoSqlAddCategoria = await readCommandSql.restornaStringSql('adicionarCategoria', 'categoria');
            var nova_categoria = await db.Query(ComandoSqlAddCategoria, dados_categoria[0]);

            if (nova_categoria.insertId != undefined && nova_categoria.insertId > 0) {

                // se deu certo o cadastro e retornou o ID da categoria cadastrada, percorre os produtos e adiciona na nova categoria

                const promises = await produtos_categoria.map(async elem => {

                    // cria um ID baseado na data e hora (para ser único), para passar pra imagem na hora de copiar
                    const idImagemNovo = new Date().valueOf();

                    // guarda o valor da imagem antiga (produto atual)
                    var imagemOld = elem.imagem;

                    var metodoImagem = 'adicionarProdutoDuplicadoSemImagem';

                    if (imagemOld != null) {
                        metodoImagem = 'adicionarProdutoDuplicado';
                        imagemOld = idImagemNovo + '-' + imagemOld;
                    }

                    // adicionar o produto na nova categoria
                    var ComandoSqlAddProduto = await readCommandSql.restornaStringSql(metodoImagem, 'produto');
                    await db.Query(ComandoSqlAddProduto, {
                        idcategoria: nova_categoria.insertId,
                        nome: elem.nome,
                        descricao: elem.descricao,
                        valor: elem.valor,
                        imagem: imagemOld,
                        ordem: elem.ordem
                    });

                    if (imagemOld != null) {
                        // faz uma cópia da imagem para a pasta
                        await ctImagem.controllers().copy(elem.imagem, idImagemNovo);
                    }

                })

                await Promise.all(promises);

                return {
                    status: 'success',
                    message: 'Categoria duplicada com sucesso.'
                }

            }
            else {
                return {
                    status: 'error',
                    message: 'Falha ao duplicar a categoria. Tente novamente.'
                }
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao ordenar categorias. Tente novamente.'
            }
        }

    }

    const removerCategoria = async (req) => {

        try {

            var idcategoria = req.body.idcategoria;

            // obtem todos os produtos da categoria (para depois remover as imagens)

            var ComandoSqlSelectProdutos = await readCommandSql.restornaStringSql('obterPorCategoriaIdSemOrdenacao', 'produto');
            var produtos_categoria = await db.Query(ComandoSqlSelectProdutos, { idcategoria: idcategoria });

            // remove todos os produtos

            var ComandoSqlRemoveProdutos = await readCommandSql.restornaStringSql('removerPorCategoriaId', 'produto');
            await db.Query(ComandoSqlRemoveProdutos, { idcategoria: idcategoria });
            
            // depois, remove a categoria

            var ComandoSqlRemoveCategoria = await readCommandSql.restornaStringSql('removerPorId', 'categoria');
            await db.Query(ComandoSqlRemoveCategoria, { idcategoria: idcategoria });

            // por fim, remove as imagens dos produtos da pasta

            const promises = await produtos_categoria.map(async elem => {
                
                const requisicao = {
                    body: {
                        idproduto: elem.idproduto,
                        apagado: 1
                    }
                }
    
                await ctImagem.controllers().removeImagemProduto(requisicao);

            })

            await Promise.all(promises);

            return {
                status: 'success',
                message: "Categorias removida."
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover a categoria. Tente novamente.'
            }
        }

    }


    return Object.create({
        listarTodas
        , salvarDados
        , ordenarCategorias
        , duplicarCategoria
        , removerCategoria
    })

}

module.exports = Object.assign({ controllers })