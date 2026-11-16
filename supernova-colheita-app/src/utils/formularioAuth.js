import { dataBrParaIso, emailValido, somenteDigitos, ufValida } from './validacoes';

export function validarLogin({ email, senha }) {
  const erros = {};
  if (!emailValido(email)) erros.email = 'Informe um e-mail válido.';
  if (!senha) erros.senha = 'Informe a senha.';
  return erros;
}

export function validarCadastro(tipoConta, form) {
  const erros = {};

  if (!form.nome.trim()) erros.nome = 'Informe o nome.';
  if (!emailValido(form.email)) erros.email = 'Informe um e-mail válido.';
  if (form.senha.length < 6) erros.senha = 'A senha deve ter pelo menos 6 caracteres.';
  if (form.confirmacao !== form.senha) erros.confirmacao = 'As senhas não conferem.';
  if (!form.municipio.trim()) erros.municipio = 'Informe o município.';
  if (!ufValida(form.uf)) erros.uf = 'Use a sigla com 2 letras (ex.: SP).';

  if (tipoConta === 'PRODUTOR') {
    if (somenteDigitos(form.cpf).length !== 11) erros.cpf = 'O CPF deve ter 11 dígitos.';
    const temCaf = Boolean(form.numeroCaf.trim());
    const temValidade = Boolean(form.validadeCaf.trim());
    if (temCaf !== temValidade) {
      erros.validadeCaf = 'Informe o número do CAF junto com a validade.';
    } else if (temValidade && !dataBrParaIso(form.validadeCaf)) {
      erros.validadeCaf = 'Use o formato DD/MM/AAAA.';
    }
  } else {
    if (somenteDigitos(form.cnpj).length !== 14) erros.cnpj = 'O CNPJ deve ter 14 dígitos.';
    if (form.tipoComprador === 'ESCOLA' && !(Number(form.verbaPnaeAnual) > 0)) {
      erros.verbaPnaeAnual = 'Escolas precisam informar a verba anual do PNAE.';
    }
  }

  return erros;
}

// Monta o corpo que a API espera em /auth/registro/produtor ou /comprador
export function montarCadastro(tipoConta, form) {
  const base = { email: form.email.trim(), senha: form.senha };
  const local = { municipio: form.municipio.trim(), uf: form.uf };

  if (tipoConta === 'PRODUTOR') {
    return {
      ...base,
      produtor: {
        nome: form.nome.trim(),
        cpf: somenteDigitos(form.cpf),
        numeroCaf: form.numeroCaf.trim() || null,
        validadeCaf: dataBrParaIso(form.validadeCaf),
        telefone: somenteDigitos(form.telefone) || null,
        email: form.email.trim(),
        ...local,
      },
    };
  }

  return {
    ...base,
    comprador: {
      nome: form.nome.trim(),
      tipo: form.tipoComprador,
      cnpj: somenteDigitos(form.cnpj),
      verbaPnaeAnual: form.tipoComprador === 'ESCOLA' ? Number(form.verbaPnaeAnual) : null,
      email: form.email.trim(),
      ...local,
    },
  };
}
