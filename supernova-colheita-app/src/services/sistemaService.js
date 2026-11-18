import api, { apiNet } from './api';

// Qualquer resposta do health (mesmo 503 com um servico dependente fora) mostra que a API esta no ar
export async function verificarApi() {
  const resposta = await api.get('/actuator/health', {
    timeout: 10000,
    validateStatus: () => true,
  });
  return { online: true, status: resposta.data?.status ?? 'DESCONHECIDO' };
}

export async function verificarApiNet() {
  const resposta = await apiNet.get('/health', { timeout: 10000, validateStatus: () => true });
  return {
    online: true,
    status: typeof resposta.data === 'string' ? resposta.data : 'DESCONHECIDO',
  };
}
