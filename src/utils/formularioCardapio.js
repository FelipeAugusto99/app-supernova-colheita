// Aceita "3000", "3000.50", "3.000,50" ou "3000,50"
export function textoParaNumero(texto = '') {
  const limpo = String(texto)
    .trim()
    .replace(/\s|R\$/g, '');
  if (limpo.includes(',')) {
    return Number(limpo.replace(/\./g, '').replace(',', '.'));
  }
  return Number(limpo);
}

export const formularioInicial = {
  numeroAlunos: '',
  orcamento: '',
  diasLetivos: 5,
  restricoes: '',
};

export function validarCardapio(form) {
  const erros = {};
  const alunos = Number(form.numeroAlunos);
  const orcamento = textoParaNumero(form.orcamento);

  if (!Number.isInteger(alunos) || alunos < 1 || alunos > 5000) {
    erros.numeroAlunos = 'Informe de 1 a 5000 alunos.';
  }
  if (!(orcamento > 0)) {
    erros.orcamento = 'Informe um orçamento maior que zero.';
  }
  if (form.restricoes.length > 500) {
    erros.restricoes = 'Use até 500 caracteres.';
  }
  return erros;
}

export function montarPedidoDeCardapio(form) {
  const restricoes = form.restricoes.trim();
  return {
    numeroAlunos: Number(form.numeroAlunos),
    orcamento: textoParaNumero(form.orcamento),
    diasLetivos: form.diasLetivos,
    ...(restricoes ? { restricoes } : {}),
  };
}
