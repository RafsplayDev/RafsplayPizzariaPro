--INIT#login#

SELECT idempresa, nome, email, senha, logotipo FROM empresa WHERE email = @email

--END#login#