const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const mv = require('mv');
const fs = require('fs');

const controllers = () => {

    const copy = async (imagem, id) => {

        try {
            
            // obtem a imagem atual
            var inStr = fs.createReadStream(`server/public/images/${imagem}`);

            // cria um "modelo" de imagem, com o ID na frente )passado nos parametros)
            var outStr = fs.createWriteStream(`server/public/images/${id}-${imagem}`);

            // aqui faz a cópia da imagem para o modelo, com o ID na frente para diferenciar
            inStr.pipe(outStr);

            return {
                status: 'success',
                message: "Imagem duplicada com sucesso!"
            }


        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao duplicar a imagem.'
            }
        }

    }

    // Faz o upload do logotipo da empresa
    const uploadLogo = async (req) => {

        try {

            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            const imagem = req.files.image;

            let name = imagem.name.split('.');

            const extension = name[name.length - 1];

            const new_path = `server/public/images/empresa/${name[0]}.${extension}`;

            mv(imagem.path, new_path, {
                mkdirp: true // se não existir, cria o diretório
            }, (err, result) => {
                if (err) {
                    return false;
                }
            })

            var ComandoSql = await readCommandSql.restornaStringSql('adicionarImagem', 'empresa');
            await db.Query(ComandoSql, { idempresa: _empresaId, logotipo: `${name[0]}.${extension}` });

            return {
                status: 'success',
                message: 'Imagem atualizada com sucesso!',
                logotipo: `${name[0]}.${extension}`
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao salvar imagem. Tente novamente.'
            }
        }

    }

    // Remove o logotipo da empresa
    const removeLogo = async (req) => {

        try {

            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            const imagem = req.body.imagem;

            var filePath = `server/public/images/empresa/${imagem}`;
            fs.unlinkSync(filePath);

            var ComandoSql = await readCommandSql.restornaStringSql('removerImagem', 'empresa');
            await db.Query(ComandoSql, { idempresa: _empresaId });

            return {
                status: 'success',
                message: 'Imagem removida com sucesso!'
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover imagem. Tente novamente.'
            }
        }

    }


    // Faz o upload da imagem do produto
    const uploadImagemProduto = async (req) => {

        try {

            const idproduto = req.params.idproduto;

            const imagem = req.files.image;

            const idImagemNovo = new Date().valueOf();

            let name = imagem.name.split('.');

            const extension = name[name.length - 1];

            const new_path = `server/public/images/${idImagemNovo}-${name[0]}.${extension}`;

            mv(imagem.path, new_path, {
                mkdirp: true // se não existir, cria o diretório
            }, (err, result) => {
                if (err) {
                    return false;
                }
            })

            var ComandoSql = await readCommandSql.restornaStringSql('adicionarImagemProduto', 'produto');
            await db.Query(ComandoSql, { idproduto: idproduto, imagem: `${idImagemNovo}-${name[0]}.${extension}` });

            return {
                status: 'success',
                message: 'Imagem atualizada com sucesso!'
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao salvar imagem. Tente novamente.'
            }
        }

    }

    // Remove a imagem do produto
    const removeImagemProduto = async (req) => {

        try {

            const idproduto = req.body.idproduto;

            var ComandoSqlObterPorId = await readCommandSql.restornaStringSql('obterPorId', 'produto');
            var dados_produto = await db.Query(ComandoSqlObterPorId, { idproduto: idproduto });

            if (dados_produto.length > 0 && dados_produto[0].imagem == null) {
                return {
                    status: 'success'
                }
            }

            var filePath = `server/public/images/${dados_produto[0].imagem}`;
            fs.unlinkSync(filePath);

            var ComandoSql = await readCommandSql.restornaStringSql('removerImagemProduto', 'produto');
            await db.Query(ComandoSql, { idproduto: idproduto });

            return {
                status: 'success',
                message: 'Imagem removida com sucesso!'
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover imagem. Tente novamente.'
            }
        }

    }

    return Object.create({
        uploadLogo
        , removeLogo
        , uploadImagemProduto
        , removeImagemProduto
        , copy
    })

}

module.exports = Object.assign({ controllers })