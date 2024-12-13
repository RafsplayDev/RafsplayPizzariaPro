--INIT#obterTiposEntrega#

SELECT * FROM tipoentrega

--END#obterTiposEntrega#


--INIT#ativarTipoEntrega#

UPDATE
    tipoentrega
SET
    ativo = @ativo
WHERE
    idtipoentrega = @idtipoentrega

--END#ativarTipoEntrega#


--INIT#salvarTempoTipoEntrega#

UPDATE
    tipoentrega
SET
    tempominimo = @minimo
    , tempomaximo = @maximo
WHERE
    idtipoentrega = @tipo

--END#salvarTempoTipoEntrega#

--INIT#obterTaxaEntregaAtiva#

SELECT
	tet.idtaxaentregatipo
    , te.idtaxaentrega
    , te.valor
    , te.distancia
    , te.tempominimo
    , te.tempomaximo
FROM
	taxaentregatipo AS tet
    LEFT JOIN taxaentrega AS te ON te.idtaxaentregatipo = tet.idtaxaentregatipo
		AND te.ativo = 1
        AND te.apagado = 0
WHERE
	tet.ativo = 1

--END#obterTaxaEntregaAtiva#

--INIT#obterValorTaxaPorKm#

SELECT
	idtaxaentrega
    , valor
FROM
	taxaentrega
WHERE
	distancia >= @distancia
    AND idtaxaentregatipo = 2
    AND ativo = 1
    AND apagado = 0

--END#obterValorTaxaPorKm#