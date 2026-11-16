import { dataBrParaIso } from './validacoes';
import { formatarData, hojeBr } from './formatadores';

export function formularioInicial(oferta) {
  if (!oferta) {
    return {
      produtoId: null,
      precoUnitario: '',
      qtdDisponivel: '',
      dataColheita: hojeBr(),
      dataValidade: '',
    };
  }
  return {
    produtoId: oferta.produtoId,
    precoUnitario: String(oferta.precoUnitario),
    qtdDisponivel: String(oferta.qtdDisponivel),
    dataColheita: formatarData(oferta.dataColheita),
    dataValidade: formatarData(oferta.dataValidade),
  };
}

const numero = (texto) => Number(String(texto).replace(',', '.'));

export function validarOferta(form) {
  const erros = {};
  const colheita = dataBrParaIso(form.dataColheita);
  const validade = dataBrParaIso(form.dataValidade);
  const hoje = dataBrParaIso(hojeBr());

  if (!form.produtoId) erros.produtoId = 'Escolha o produto.';
  if (!(numero(form.precoUnitario) > 0)) erros.precoUnitario = 'Informe um preço maior que zero.';
  if (form.qtdDisponivel === '' || !(numero(form.qtdDisponivel) >= 0)) {
    erros.qtdDisponivel = 'Informe a quantidade disponível.';
  }
  if (!colheita) erros.dataColheita = 'Use o formato DD/MM/AAAA.';
  else if (colheita > hoje) erros.dataColheita = 'A colheita não pode ser no futuro.';
  if (!validade) erros.dataValidade = 'Use o formato DD/MM/AAAA.';
  else if (colheita && validade < colheita) {
    erros.dataValidade = 'A validade não pode ser antes da colheita.';
  }

  return erros;
}

export function montarOferta(form) {
  return {
    produtoId: form.produtoId,
    precoUnitario: numero(form.precoUnitario),
    qtdDisponivel: numero(form.qtdDisponivel),
    dataColheita: dataBrParaIso(form.dataColheita),
    dataValidade: dataBrParaIso(form.dataValidade),
  };
}
