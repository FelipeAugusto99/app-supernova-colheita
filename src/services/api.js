import { create } from 'axios';

const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.10:8080',
  timeout: 15000,
});

// API .NET (oportunidades e clima): aceita o mesmo token JWT emitido pela API Java
export const apiNet = create({
  baseURL: process.env.EXPO_PUBLIC_API_NET_URL || 'http://192.168.0.10:5256',
  timeout: 15000,
});

export function definirToken(token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  apiNet.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function limparToken() {
  delete api.defaults.headers.common.Authorization;
  delete apiNet.defaults.headers.common.Authorization;
}

// Quando a API responde 401 com um token configurado, a sessao expirou
export function registrarInterceptadorNaoAutorizado(aoNaoAutorizar) {
  const id = api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
      if (erro.response?.status === 401 && api.defaults.headers.common.Authorization) {
        aoNaoAutorizar();
      }
      return Promise.reject(erro);
    }
  );

  return () => api.interceptors.response.eject(id);
}

export default api;
