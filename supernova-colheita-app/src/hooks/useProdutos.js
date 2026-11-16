import { useQuery } from '@tanstack/react-query';

import { listarProdutos } from '../services/produtosService';

export function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: listarProdutos,
    staleTime: 5 * 60 * 1000,
  });
}
