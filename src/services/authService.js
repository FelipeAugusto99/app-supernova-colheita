import api from './api';

export async function autenticar(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function registrarProdutor({ email, senha, produtor }) {
  const { data } = await api.post('/auth/registro/produtor', { email, senha, produtor });
  return data;
}

export async function registrarComprador({ email, senha, comprador }) {
  const { data } = await api.post('/auth/registro/comprador', { email, senha, comprador });
  return data;
}

export async function buscarUsuarioLogado() {
  const { data } = await api.get('/auth/me');
  return data;
}
