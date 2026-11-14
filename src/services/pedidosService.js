import api from './api';

export async function listarPedidos({ pagina = 0, tamanho = 10 } = {}) {
  const { data } = await api.get('/pedidos', {
    params: { page: pagina, size: tamanho, sort: 'dataPedido,desc' },
  });
  return data;
}

export async function buscarPedido(id) {
  const { data } = await api.get(`/pedidos/${id}`);
  return data;
}

// itens: [{ ofertaId, quantidade }]
export async function criarPedido(itens) {
  const { data } = await api.post('/pedidos', { itens });
  return data;
}

export async function atualizarStatusPedido(id, status) {
  const { data } = await api.patch(`/pedidos/${id}/status`, { status });
  return data;
}
