import api from './api';

// A IA pode levar mais de um minuto para montar o cardapio
const TEMPO_GERACAO = 150000;

export async function gerarCardapio(dados) {
  const { data } = await api.post('/cardapios', dados, { timeout: TEMPO_GERACAO });
  return data;
}

export async function listarCardapios({ pagina = 0, tamanho = 10 } = {}) {
  const { data } = await api.get('/cardapios', {
    params: { page: pagina, size: tamanho, sort: 'dataCriacao,desc' },
  });
  return data;
}

export async function buscarCardapio(id) {
  const { data } = await api.get(`/cardapios/${id}`);
  return data;
}

export async function converterEmPedido(id) {
  const { data } = await api.post(`/cardapios/${id}/pedido`);
  return data;
}

export async function excluirCardapio(id) {
  await api.delete(`/cardapios/${id}`);
}
