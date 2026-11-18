import { apiNet } from './api';

// A API .NET repassa os dados atuais da Open-Meteo
export async function consultarClima(latitude, longitude) {
  const { data } = await apiNet.get('/api/clima', { params: { latitude, longitude } });
  const atual = data.current ?? {};
  return {
    horario: atual.time,
    temperatura: atual.temperature_2m,
    umidade: atual.relative_humidity_2m,
    chuva: atual.precipitation,
    vento: atual.wind_speed_10m,
  };
}
