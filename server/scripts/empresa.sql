--INIT#obterDados#

SELECT 
    nome, 
    logotipo
FROM 
    empresa 

--END#obterDados#

--INIT#obterDadosCompletos#

SELECT 
    nome, 
    cep,
    endereco,
    numero,
    bairro,
    complemento,
    cidade,
    estado,
    logotipo,
    sobre
FROM 
    empresa 

--END#obterDadosCompletos#



--INIT#salvarDadosSobre#

UPDATE 
    empresa
SET
    nome = @nome,
    sobre = @sobre
WHERE
    idempresa = @idempresa

--END#salvarDadosSobre#


--INIT#adicionarImagem#

UPDATE 
    empresa
SET
    logotipo = @logotipo
WHERE
    idempresa = @idempresa

--END#adicionarImagem#

--INIT#removerImagem#

UPDATE 
    empresa
SET
    logotipo = NULL
WHERE
    idempresa = @idempresa

--END#removerImagem#

--INIT#salvarDadosEndereco#

UPDATE 
    empresa
SET
    cep = @cep,
    endereco = @endereco,
    numero = @numero,
    bairro = @bairro,
    complemento = @complemento,
    cidade = @cidade,
    estado = @estado
WHERE
    idempresa = @idempresa

--END#salvarDadosEndereco#


