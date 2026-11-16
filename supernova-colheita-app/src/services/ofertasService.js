import api from './api';

export async function listarOfertas({ pagina = 0, tamanho = 10, status, produtoId, uf } = {}) {
  const { data } = await api.get('/ofertas', {
    params: { page: pagina, size: tamanho, status, produtoId, uf, sort: 'dataValidade' },
  });
  return data;
}

export async function listarMinhasOfertas({ pagina = 0, tamanho = 20 } = {}) {
  const { data } = await api.get('/ofertas/minhas', {
    params: { page: pagina, size: tamanho, sort: 'dataValidade,desc' },
  });
  return data;
}

export async function buscarOferta(id) {
  const { data } = await api.get(`/ofertas/${id}`);
  return data;
}

export async function criarOferta(oferta) {
  const { data } = await api.post('/ofertas', oferta);
  return data;
}

export async function atualizarOferta(id, oferta) {
  const { data } = await api.put(`/ofertas/${id}`, oferta);
  return data;
}

// A API nao apaga a oferta: muda o status para CANCELADA (mantem o historico)
export async function cancelarOferta(id) {
  await api.delete(`/ofertas/${id}`);
}
