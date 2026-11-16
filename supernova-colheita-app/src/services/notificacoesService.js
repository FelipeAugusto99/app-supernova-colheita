import api from './api';

export async function listarNotificacoes({ pagina = 0, tamanho = 20 } = {}) {
  const { data } = await api.get('/notificacoes', { params: { page: pagina, size: tamanho } });
  return data;
}

export async function marcarComoLida(id) {
  const { data } = await api.patch(`/notificacoes/${id}/lida`);
  return data;
}
