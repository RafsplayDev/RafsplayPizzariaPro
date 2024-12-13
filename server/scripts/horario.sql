--INIT#obterHorarios#

SELECT 
    diainicio
    , diafim
    , iniciohorarioum
    , fimhorarioum
    , iniciohorariodois
    , fimhorariodois
FROM
    horario
WHERE
    idempresa = 3 

--END#obterHorarios#

--INIT#removerHorarios#

DELETE FROM horario WHERE idempresa = @idempresa

--END#removerHorarios#

--INIT#salvarHorario#

INSERT INTO horario
(idempresa, diainicio, diafim, iniciohorarioum, fimhorarioum, iniciohorariodois, fimhorariodois)
VALUES
(@idempresa, @diainicio, @diafim, @iniciohorarioum, @fimhorarioum, @iniciohorariodois, @fimhorariodois)

--END#salvarHorario#