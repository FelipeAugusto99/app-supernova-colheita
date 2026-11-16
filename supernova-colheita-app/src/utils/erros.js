// Converte os erros do Axios e da API (ErroResponse) em mensagens para o usuario

export function mensagemDeErro(erro, padrao = 'Não foi possível concluir a operação.') {
  if (!erro?.response) {
    if (erro?.code === 'ECONNABORTED') {
      return 'A API demorou para responder. Tente novamente.';
    }
    return 'Sem conexão com a API. Verifique a internet e o endereço configurado.';
  }
  return erro.response.data?.mensagem ?? padrao;
}

// "produtor.cpf" -> { cpf: "mensagem" }
export function errosDeCampo(erro) {
  const campos = erro?.response?.data?.campos ?? [];
  return campos.reduce((resultado, { campo, mensagem }) => {
    const nome = campo.split('.').pop();
    return { ...resultado, [nome]: mensagem };
  }, {});
}
