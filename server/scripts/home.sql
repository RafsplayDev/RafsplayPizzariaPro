--INIT#obterTotaisFormaPagamento#

SELECT
    COUNT(idpedido) AS 'total',
    SUM(CASE WHEN idformapagamento = 1 THEN 1 ELSE 0 END) AS 'pix',
    SUM(CASE WHEN idformapagamento = 2 THEN 1 ELSE 0 END) AS 'dinheiro',
    SUM(CASE WHEN idformapagamento = 3 THEN 1 ELSE 0 END) AS 'credito',
    SUM(CASE WHEN idformapagamento = 4 THEN 1 ELSE 0 END) AS 'debito'
FROM
    pedido
WHERE
    idpedidostatus = 5

--END#obterTotaisFormaPagamento#


--INIT#obterTotaisTiposEntrega#

SELECT
    COUNT(idpedido) AS 'total',
    SUM(CASE WHEN idtipoentrega = 1 THEN 1 ELSE 0 END) AS 'delivery',
    SUM(CASE WHEN idtipoentrega = 2 THEN 1 ELSE 0 END) AS 'retirada'
FROM
    pedido
WHERE
    idpedidostatus = 5

--END#obterTotaisTiposEntrega#


--INIT#obterTotaisPedidosHoje#

SELECT
	SUM(total) as total,
    COUNT(idpedido) as pedidos
FROM
	pedido
WHERE
	idpedidostatus = 5
    AND datafinalizado BETWEEN @datainicio AND @datafim

--END#obterTotaisPedidosHoje#


--INIT#obterTotaisDiasSemana#

SELECT
	datafinalizado
FROM
	pedido
WHERE
	idpedidostatus = 5

--END#obterTotaisDiasSemana#