--INIT#salvarPedido#

INSERT INTO pedido
(idpedidostatus, idtipoentrega, idtaxaentrega, idformapagamento, troco, total, cep, endereco, numero, bairro, complemento, cidade, estado, nomecliente, telefonecliente)
VALUES
(@idpedidostatus, @idtipoentrega, @idtaxaentrega, @idformapagamento, @troco, @total, @cep, @endereco, @numero, @bairro, @complemento, @cidade, @estado, @nomecliente, @telefonecliente)

--END#salvarPedido#

--INIT#salvarPedidoItem#

INSERT INTO pedidoitem
(idpedido, idproduto, quantidade, observacao)
VALUES
(@idpedido, @idproduto, @quantidade, @observacao)

--END#salvarPedidoItem#

--INIT#salvarPedidoItemOpcional#

INSERT INTO pedidoitemopcional
(idpedidoitem, idopcionalitem)
VALUES
(@idpedidoitem, @idopcionalitem)

--END#salvarPedidoItemOpcional#

--INIT#obterPedidoPorId#

SELECT
    p.idpedidostatus
    , ps.descricao AS pedidostatus
    , p.idtipoentrega
    , p.idtaxaentrega
    , p.idformapagamento
    , fa.nome AS formapagamento
    , p.troco
    , p.total
    , p.cep
    , p.endereco
    , p.numero
    , p.bairro
    , p.complemento
    , p.cidade
    , p.estado
    , p.nomecliente
    , p.telefonecliente
    , p.datacadastro
    , p.motivorecusa
    , te.valor AS taxaentrega
    , te.tempominimo AS entregatempominimo
    , te.tempomaximo AS entregatempomaximo
FROM
    pedido AS p
    JOIN pedidostatus AS ps ON ps.idpedidostatus = p.idpedidostatus
    JOIN formapagamento AS fa ON fa.idformapagamento = p.idformapagamento
    LEFT JOIN taxaentrega AS te ON te.idtaxaentrega = p.idtaxaentrega
WHERE
    idpedido = @idpedido

--END#obterPedidoPorId#


--INIT#obterItensPedido#

SELECT
	pi.idpedidoitem
    , pi.quantidade
    , pi.observacao
    , p.nome
    , p.valor
    , op.idopcionalitem
    , op.nome AS nomeopcional
    , op.valor AS valoropcional
FROM
	pedidoitem AS pi
    JOIN produto AS p ON p.idproduto = pi.idproduto
    LEFT JOIN pedidoitemopcional AS po ON po.idpedidoitem = pi.idpedidoitem
    LEFT JOIN opcionalitem AS op ON op.idopcionalitem = po.idopcionalitem
WHERE
	pi.idpedido = @idpedido

--END#obterItensPedido#

--INIT#obterPedidoPorStatus#

SELECT
    idpedido
    , idpedidostatus
    , idtipoentrega
    , idformapagamento
    , nomecliente
    , datacadastro
    , datafinalizado
    , total
    , troco
FROM
    pedido
WHERE
    idpedidostatus = @idpedidostatus

--END#obterPedidoPorStatus#

--INIT#obterPedidosConcluidos#

SELECT
    idpedido
    , idpedidostatus
    , idtipoentrega
    , idformapagamento
    , nomecliente
    , datacadastro
    , datafinalizado
    , total
    , troco
FROM
    pedido
WHERE
    idpedidostatus = 5
ORDER BY
    idpedido DESC
LIMIT 20

--END#obterPedidosConcluidos#

--INIT#obterTotaisPedidos#

SELECT
    SUM(CASE WHEN idpedidostatus = 1 THEN 1 ELSE 0 END) AS 'pendente',
    SUM(CASE WHEN idpedidostatus = 2 THEN 1 ELSE 0 END) AS 'aceito',
    SUM(CASE WHEN idpedidostatus = 3 THEN 1 ELSE 0 END) AS 'preparo',
    SUM(CASE WHEN idpedidostatus = 4 THEN 1 ELSE 0 END) AS 'entrega'
FROM
    pedido
WHERE
    idpedidostatus <> 5
    AND idpedidostatus <> 6

--END#obterTotaisPedidos#


--INIT#atualizarStatusPedido#

UPDATE pedido
SET idpedidostatus = @idpedidostatus
WHERE idpedido = @idpedido

--END#atualizarStatusPedido#

--INIT#atualizarStatusPedidoFinalizado#

UPDATE pedido
SET idpedidostatus = @idpedidostatus, datafinalizado = CURRENT_TIMESTAMP()
WHERE idpedido = @idpedido

--END#atualizarStatusPedidoFinalizado#

--INIT#recusarPedido#

UPDATE pedido
SET idpedidostatus = 6, motivorecusa = @motivo
WHERE idpedido = @idpedido

--END#recusarPedido#


--INIT#historicoPedidos#

SELECT
    p.idpedido
    , p.nomecliente
    , te.nome AS tipoentrega
    , fp.nome AS formapagamento
    , p.datacadastro
    , ps.idpedidostatus
    , ps.descricao AS pedidostatus
    , p.total
FROM
    pedido AS p
    JOIN pedidostatus AS ps ON ps.idpedidostatus = p.idpedidostatus
    JOIN tipoentrega AS te ON te.idtipoentrega = p.idtipoentrega
    JOIN formapagamento AS fp ON fp.idformapagamento = p.idformapagamento
WHERE
    p.datacadastro BETWEEN @datainicio AND @datafim
ORDER BY
    p.idpedido DESC

--END#historicoPedidos#