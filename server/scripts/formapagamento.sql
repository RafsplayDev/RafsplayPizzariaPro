--INIT#obterFormasPagamentoAtivas#

SELECT 
    idformapagamento
    , nome
FROM 
    formapagamento
WHERE
    ativo = 1

--END#obterFormasPagamentoAtivas#


--INIT#obterTodasFormasPagamento#

SELECT * FROM formapagamento

--END#obterTodasFormasPagamento#


--INIT#ativarFormaPagamento#

UPDATE
    formapagamento
SET
    ativo = @ativo
WHERE
    idformapagamento = @idformapagamento

--END#ativarFormaPagamento#