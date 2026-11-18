import { apiNet } from './api';

export async function listarOportunidades() {
  const { data } = await apiNet.get('/api/oportunidades');
  return data;
}

export async function buscarOportunidade(id) {
  const { data } = await apiNet.get(`/api/oportunidades/${id}`);
  return data;
}

export async function criarOportunidade(oportunidade) {
  const { data } = await apiNet.post('/api/oportunidades', oportunidade);
  return data;
}

export async function excluirOportunidade(id) {
  await apiNet.delete(`/api/oportunidades/${id}`);
}
