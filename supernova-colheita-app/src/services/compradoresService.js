import api from './api';

export async function buscarComprador(id) {
  const { data } = await api.get(`/compradores/${id}`);
  return data;
}
