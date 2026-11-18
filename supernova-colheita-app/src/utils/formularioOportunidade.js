import { textoParaNumero } from './formularioCardapio';
import { formatarData } from './formatadores';
import { dataBrParaIso, ufValida } from './validacoes';

export function formularioInicial(usuario) {
  const daqui30Dias = new Date();
  daqui30Dias.setDate(daqui30Dias.getDate() + 30);
  return {
    titulo: '',
    instituicao: usuario.role === 'COMPRADOR' ? usuario.nome : '',
    municipio: '',
    estado: '',
    valorEstimado: '',
    prazoInscricao: formatarData(daqui30Dias.toISOString()),
  };
}

export function validarOportunidade(form) {
  const erros = {};
  const prazo = dataBrParaIso(form.prazoInscricao);
  const hoje = new Date().toISOString().slice(0, 10);

  if (form.titulo.trim().length < 5) erros.titulo = 'Descreva a chamada (mínimo 5 letras).';
  if (!form.instituicao.trim()) erros.instituicao = 'Informe a instituição.';
  if (!form.municipio.trim()) erros.municipio = 'Informe o município.';
  if (!ufValida(form.estado)) erros.estado = 'Use a sigla com 2 letras (ex.: SP).';
  if (!(textoParaNumero(form.valorEstimado) > 0)) {
    erros.valorEstimado = 'Informe um valor maior que zero.';
  }
  if (!prazo) erros.prazoInscricao = 'Use o formato DD/MM/AAAA.';
  else if (prazo < hoje) erros.prazoInscricao = 'O prazo não pode estar no passado.';

  return erros;
}

export function montarOportunidade(form) {
  return {
    titulo: form.titulo.trim(),
    instituicao: form.instituicao.trim(),
    municipio: form.municipio.trim(),
    estado: form.estado,
    valorEstimado: textoParaNumero(form.valorEstimado),
    prazoInscricao: `${dataBrParaIso(form.prazoInscricao)}T23:59:00`,
    ativa: true,
  };
}
