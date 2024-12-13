const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const ctImagem = require('../controllers/imagem');

const controllers = () => {

    const listaCardapio = async (req) => {
        
        try {

            var ComandoSql = await readCommandSql.restornaStringSql('listaCardapio', 'produto');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os produtos.'
            }
        }
        
    }

    const obterPorId = async (req) => {
        
        try {

            const id = req.params.id;

            var ComandoSql = await readCommandSql.restornaStringSql('obterPorId', 'produto');
            var result = await db.Query(ComandoSql, { idproduto: id });

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter dados do produto.'
            }
        }
        
    }

    const obterPorCategoriaId = async (req) => {
        
        try {

            const id = req.params.id;

            var ComandoSql = await readCommandSql.restornaStringSql('obterPorCategoriaId', 'produto');
            var result = await db.Query(ComandoSql, { idcategoria: id });

            return {
                status: 'success',
                data: result
            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter os produtos.'
            }
        }
        
    }

    const ordenarProdutos = async (req) => {
        
        try {

            var lista = req.body;

            const promises = await lista.map(async elem => {
                new Promise(async (resolve, reject) => {

                    var ComandoSql = await readCommandSql.restornaStringSql('atualizarOrdemProduto', 'produto');
                    await db.Query(ComandoSql, elem);

                    resolve(elem);

                })
            })

            await Promise.all(promises);

            return {
                status: 'success',
                message: "Produtos ordenados com sucesso."
            }

            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao ordenar produtos. Tente novamente.'
            }
        }
        
    }

    const salvarDados = async (req) => {
        
        try {

            var idproduto = req.body.idproduto;

            if (idproduto > 0) {

                // atualizar o produto

                var ComandoSql = await readCommandSql.restornaStringSql('atualizarProduto', 'produto');
                var result = await db.Query(ComandoSql, req.body);

                return {
                    status: 'success',
                    message: "Produto atualizado com sucesso!"
                }

            }
            else {

                // inserir um novo produto

                var ComandoSql = await readCommandSql.restornaStringSql('adicionarProduto', 'produto');
                var result = await db.Query(ComandoSql, req.body);

                return {
                    status: 'success',
                    message: "Produto adicionado com sucesso!"
                }

            }
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao salvar produto. Tente novamente.'
            }
        }
        
    }

    const removerProduto = async (req) => {
        
        try {

            var idproduto = req.body.idproduto;

            // remove a imagem do produto
            // cria um objeto da mesma estrutura que o método de removeImagemProduto espera.
            const requisicao = {
                body: {
                    idproduto: idproduto,
                    apagado: 0
                }
            }

            const imagemRemovida = await ctImagem.controllers().removeImagemProduto(requisicao);

            if (imagemRemovida.status == "success") {

                // remove o produto
                var ComandoSql = await readCommandSql.restornaStringSql('removerPorProdutoId', 'produto');
                await db.Query(ComandoSql, { idproduto: idproduto });

                return {
                    status: 'success',
                    message: "Produto removido."
                }

            }
            else {
                return {
                    status: 'error',
                    message: 'Falha ao remover produto. Tente novamente.'
                }
            }                     
            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover produto. Tente novamente.'
            }
        }
        
    }

    const duplicarProduto = async (req) => {
        
        try {

            var idproduto = req.body.idproduto;

            // cria um ID baseado na data e hora (para ser único), para passar pra imagem na hora de copiar
            const idImagemNovo = new Date().valueOf();

            // obtem as informações do produto
            var ComandoSqlProduto = await readCommandSql.restornaStringSql('obterPorId', 'produto');
            var dados_produto = await db.Query(ComandoSqlProduto, { idproduto: idproduto, apagado: 0 });

            // guarda o valor da imagem antiga (produto atual)
            const imagemOld = dados_produto[0].imagem;

            // altera o nome do produto copiado para "Cópia" e o nome da imagem para o ID criado 
            dados_produto[0].nome = dados_produto[0].nome + " - Cópia";

            var metodoImagem = '';

            if (imagemOld != null) {
                dados_produto[0].imagem = idImagemNovo + '-' + dados_produto[0].imagem;

                if (dados_produto[0].ordem != null) {
                    metodoImagem = 'adicionarProdutoDuplicado';
                }
                else {
                    metodoImagem = 'adicionarProdutoDuplicadoSemOrdem';
                }
            }
            else {
                if (dados_produto[0].ordem != null) {
                    metodoImagem = 'adicionarProdutoDuplicadoSemImagem';
                }
                else {
                    metodoImagem = 'adicionarProdutoDuplicadoSemImagemSemOrdem';
                }
            } 
            
            // adiciona o novo produto no banco
            var ComandoSqlAddProduto = await readCommandSql.restornaStringSql(metodoImagem, 'produto');
            await db.Query(ComandoSqlAddProduto, dados_produto[0]);

            if (imagemOld != null) {
                // faz uma cópia da imagem para a pasta
                await ctImagem.controllers().copy(imagemOld, idImagemNovo);
            }

            return {
                status: 'success',
                message: "Produto duplicado com sucesso."
            }

            
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover produto. Tente novamente.'
            }
        }
        
    }
    

    return Object.create({
        listaCardapio
        , obterPorId
        , obterPorCategoriaId
        , ordenarProdutos
        , salvarDados
        , removerProduto
        , duplicarProduto
    })

}

module.exports = Object.assign({ controllers })