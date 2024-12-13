--INIT#listaCardapio#

SELECT
    *
FROM
	produto
WHERE
	apagado = 0
ORDER BY
	-ordem DESC, idproduto ASC 

--END#listaCardapio#

--INIT#obterPorId#

SELECT
    idproduto
    , idcategoria
    , nome
    , descricao
    , valor
    , imagem
FROM
	produto
WHERE
    idproduto = @idproduto
	AND apagado = 0

--END#obterPorId#


--INIT#obterPorCategoriaId#

SELECT
    p.idproduto
	, p.nome
    , p.descricao
    , p.valor
    , p.imagem
    , p.ordem
    , COUNT(op.idopcional) AS opcionais
FROM
	produto AS p
    LEFT JOIN produtoopcional AS po ON po.idproduto = p.idproduto
    LEFT JOIN opcional AS op ON op.idopcional = po.idopcional
		AND op.apagado = 0
WHERE
	p.idcategoria = @idcategoria
    AND p.apagado = 0
GROUP BY
	p.idproduto
ORDER BY
	-p.ordem DESC, p.idproduto ASC 

--END#obterPorCategoriaId#


--INIT#atualizarOrdemProduto#

UPDATE
    produto
SET
    ordem = @ordem
WHERE
    idproduto = @idproduto

--END#atualizarOrdemProduto#


--INIT#atualizarProduto#

UPDATE
    produto
SET
    nome = @nome,
    valor = @valor,
    descricao = @descricao
WHERE
    idproduto = @idproduto

--END#atualizarProduto#


--INIT#adicionarProduto#

INSERT INTO produto
(idcategoria, nome, valor, descricao)
VALUES
(@idcategoria, @nome, @valor, @descricao)

--END#adicionarProduto#


--INIT#adicionarProdutoDuplicado#

INSERT INTO produto
(idcategoria, nome, valor, descricao, imagem, ordem)
VALUES
(@idcategoria, @nome, @valor, @descricao, @imagem, @ordem)

--END#adicionarProdutoDuplicado#

--INIT#adicionarProdutoDuplicadoSemOrdem#

INSERT INTO produto
(idcategoria, nome, valor, descricao, imagem)
VALUES
(@idcategoria, @nome, @valor, @descricao, @imagem)

--END#adicionarProdutoDuplicadoSemOrdem#


--INIT#adicionarProdutoDuplicadoSemImagem#

INSERT INTO produto
(idcategoria, nome, valor, descricao, ordem)
VALUES
(@idcategoria, @nome, @valor, @descricao, @ordem)

--END#adicionarProdutoDuplicadoSemImagem#

--INIT#adicionarProdutoDuplicadoSemImagemSemOrdem#

INSERT INTO produto
(idcategoria, nome, valor, descricao)
VALUES
(@idcategoria, @nome, @valor, @descricao)

--END#adicionarProdutoDuplicadoSemImagemSemOrdem#


--INIT#adicionarImagemProduto#

UPDATE
    produto
SET
    imagem = @imagem
WHERE
    idproduto = @idproduto

--END#adicionarImagemProduto#


--INIT#removerImagemProduto#

UPDATE
    produto
SET
    imagem = NULL
WHERE
    idproduto = @idproduto

--END#removerImagemProduto#

--INIT#obterPorId#

SELECT
	idproduto
    , idcategoria
    , nome
    , descricao
    , valor
    , imagem
    , ordem
FROM
	produto
WHERE
	idproduto = @idproduto
    AND apagado = @apagado

--END#obterPorId#

--INIT#removerPorProdutoId#

UPDATE
    produto
SET
    apagado = 1
WHERE
    idproduto = @idproduto

--END#removerPorProdutoId#

--INIT#obterPorCategoriaIdSemOrdenacao#

SELECT
    p.idproduto
	, p.nome
    , p.descricao
    , p.valor
    , p.imagem
    , p.ordem
FROM
	produto AS p
WHERE
	p.idcategoria = @idcategoria
    AND p.apagado = 0
ORDER BY
	p.idproduto ASC

--END#obterPorCategoriaIdSemOrdenacao#

--INIT#removerPorCategoriaId#

UPDATE
    produto
SET
    apagado = 1
WHERE
    idcategoria = @idcategoria

--END#removerPorCategoriaId#