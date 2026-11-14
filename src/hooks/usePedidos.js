import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  atualizarStatusPedido,
  buscarPedido,
  criarPedido,
  listarPedidos,
} from '../services/pedidosService';

export function usePedidos() {
  const consulta = useInfiniteQuery({
    queryKey: ['pedidos'],
    queryFn: ({ pageParam }) => listarPedidos({ pagina: pageParam }),
    initialPageParam: 0,
    getNextPageParam: ({ page }) =>
      page.number + 1 < page.totalPages ? page.number + 1 : undefined,
  });
  return { ...consulta, pedidos: consulta.data?.pages.flatMap((p) => p.content) ?? [] };
}

export function usePedido(id) {
  return useQuery({ queryKey: ['pedido', id], queryFn: () => buscarPedido(id) });
}

// Criar, confirmar ou cancelar mexe no estoque: as ofertas tambem sao recarregadas
function useAtualizarListas() {
  const queryClient = useQueryClient();
  return (pedido) => {
    queryClient.setQueryData(['pedido', pedido.id], pedido);
    queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    queryClient.invalidateQueries({ queryKey: ['ofertas'] });
    queryClient.invalidateQueries({ queryKey: ['oferta'] });
  };
}

export function useCriarPedido() {
  const atualizarListas = useAtualizarListas();
  return useMutation({ mutationFn: criarPedido, onSuccess: atualizarListas });
}

export function useAtualizarStatusPedido() {
  const atualizarListas = useAtualizarListas();
  return useMutation({
    mutationFn: ({ id, status }) => atualizarStatusPedido(id, status),
    onSuccess: atualizarListas,
  });
}
