import { useQuery } from '@tanstack/react-query';

import { consultarClima } from '../services/climaService';

export function useClima(local) {
  return useQuery({
    queryKey: ['clima', local?.latitude, local?.longitude],
    queryFn: () => consultarClima(local.latitude, local.longitude),
    enabled: Boolean(local),
    staleTime: 10 * 60 * 1000,
  });
}
