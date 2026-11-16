import api from './api';

export async function listarProdutos() {
  const { data } = await api.get('/produtos', { params: { size: 100, sort: 'nome' } });
  return data.content;
}
