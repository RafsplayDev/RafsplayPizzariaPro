
--INIT#obterTaxaEntregaTipo#

SELECT * FROM taxaentregatipo

--END#obterTaxaEntregaTipo#


--INIT#ativarTaxaEntregaTipo#

UPDATE
    taxaentregatipo
SET
    ativo = @ativo
WHERE
    idtaxaentregatipo = @idtaxaentregatipo

--END#ativarTaxaEntregaTipo#


--INIT#obterTaxaUnica#

SELECT * FROM taxaentrega WHERE idtaxaentregatipo = 1 AND ativo = 1

--END#obterTaxaUnica#


--INIT#obterTaxaUnicaPorId#

SELECT * FROM taxaentrega WHERE idtaxaentrega = @idtaxaentrega

--END#obterTaxaUnicaPorId#


--INIT#desativarTaxaUnicaPorId#

UPDATE
    taxaentrega
SET
    ativo = 0
WHERE
    idtaxaentrega = @idtaxaentrega

--END#desativarTaxaUnicaPorId#


--INIT#salvarTaxaUnica#

INSERT INTO taxaentrega
(idtaxaentregatipo, valor, tempominimo, tempomaximo)
VALUES
(@idtaxaentregatipo, @valor, @tempominimo, @tempomaximo)

--END#salvarTaxaUnica#


--INIT#obterTaxaDistancia#

SELECT * FROM taxaentrega WHERE idtaxaentregatipo = 2 AND apagado = 0

--END#obterTaxaDistancia#


--INIT#adicionarTaxaDistancia#

INSERT INTO taxaentrega
(idtaxaentregatipo, distancia, valor, tempominimo, tempomaximo)
VALUES
(2, @distancia, @valor, @tempominimo, @tempomaximo)

--END#adicionarTaxaDistancia#

--INIT#removerTaxaDistancia#

UPDATE
    taxaentrega
SET
    apagado = 1
WHERE
    idtaxaentrega = @idtaxaentrega

--END#removerTaxaDistancia#

--INIT#ativarTaxaDistancia#

UPDATE
    taxaentrega
SET
    ativo = @ativo
WHERE
    idtaxaentrega = @idtaxaentrega

--END#ativarTaxaDistancia#



