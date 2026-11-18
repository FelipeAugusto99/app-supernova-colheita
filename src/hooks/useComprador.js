import { useQuery } from '@tanstack/react-query';

import { buscarComprador } from '../services/compradoresService';

export function useComprador(id) {
  return useQuery({
    queryKey: ['comprador', id],
    queryFn: () => buscarComprador(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
