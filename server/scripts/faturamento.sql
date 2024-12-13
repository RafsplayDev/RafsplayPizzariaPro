
--INIT#filtrarFaturamento#

SELECT
	SUM(total) as total,
    DATE(datafinalizado) as filtro,
    COUNT(idpedido) as pedidos
FROM
	pedido
WHERE
	idpedidostatus = 5
    AND datafinalizado BETWEEN @datainicio AND @datafim
    @filtroCategoria
GROUP BY
	filtro
ORDER BY
	filtro DESC

--END#filtrarFaturamento#