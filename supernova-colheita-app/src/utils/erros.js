// Converte os erros do Axios e das APIs em mensagens para o usuario.
// API Java: { mensagem, campos }. API .NET: ProblemDetails { title, detail, errors }.

export function mensagemDeErro(erro, padrao = 'Não foi possível concluir a operação.') {
  if (!erro?.response) {
    if (erro?.code === 'ECONNABORTED') {
      return 'A API demorou para responder. Tente novamente.';
    }
    return 'Sem conexão com a API. Verifique a internet e o endereço configurado.';
  }
  const { status, data } = erro.response;
  if (status === 429) {
    return 'Muitas requisições em pouco tempo. Aguarde um minuto e tente de novo.';
  }
  if (status === 403) {
    return data?.mensagem ?? 'Seu perfil não tem permissão para esta ação.';
  }
  if (data?.mensagem) {
    return data.mensagem;
  }
  if (data?.errors) {
    return 'Alguns campos estão inválidos.';
  }
  return data?.detail ?? padrao;
}

// "produtor.cpf" -> { cpf: "mensagem" }; na API .NET, { Titulo: [...] } -> { titulo: "..." }
export function errosDeCampo(erro) {
  const errosNet = erro?.response?.data?.errors;
  if (errosNet && !Array.isArray(errosNet)) {
    return Object.entries(errosNet).reduce((resultado, [campo, mensagens]) => {
      const nome = campo.charAt(0).toLowerCase() + campo.slice(1);
      return { ...resultado, [nome]: [].concat(mensagens)[0] };
    }, {});
  }
  const campos = erro?.response?.data?.campos ?? [];
  return campos.reduce((resultado, { campo, mensagem }) => {
    const nome = campo.split('.').pop();
    return { ...resultado, [nome]: mensagem };
  }, {});
}
