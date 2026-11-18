import api from './api';

export async function buscarMinhaMeta(ano) {
  const { data } = await api.get('/pnae/metas/minha', { params: { ano } });
  return data;
}

export async function listarMetas(ano) {
  const { data } = await api.get('/pnae/metas', { params: { ano } });
  return data;
}
