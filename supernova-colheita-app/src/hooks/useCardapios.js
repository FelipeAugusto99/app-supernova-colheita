import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  buscarCardapio,
  converterEmPedido,
  excluirCardapio,
  gerarCardapio,
  listarCardapios,
} from '../services/cardapiosService';

export function useCardapios() {
  const consulta = useInfiniteQuery({
    queryKey: ['cardapios'],
    queryFn: ({ pageParam }) => listarCardapios({ pagina: pageParam }),
    initialPageParam: 0,
    getNextPageParam: ({ page }) =>
      page.number + 1 < page.totalPages ? page.number + 1 : undefined,
  });
  return { ...consulta, cardapios: consulta.data?.pages.flatMap((p) => p.content) ?? [] };
}

export function useCardapio(id) {
  return useQuery({ queryKey: ['cardapio', id], queryFn: () => buscarCardapio(id) });
}

export function useGerarCardapio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gerarCardapio,
    onSuccess: (cardapio) => {
      queryClient.setQueryData(['cardapio', cardapio.id], cardapio);
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
    },
  });
}

// Virar pedido baixa o estoque das ofertas e conta para a meta do PNAE
export function useConverterEmPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: converterEmPedido,
    onSuccess: () => {
      ['cardapios', 'cardapio', 'pedidos', 'ofertas', 'oferta', 'meta-pnae'].forEach((chave) =>
        queryClient.invalidateQueries({ queryKey: [chave] })
      );
    },
  });
}

export function useExcluirCardapio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: excluirCardapio,
    onSuccess: (_resultado, id) => {
      queryClient.removeQueries({ queryKey: ['cardapio', id] });
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
    },
  });
}
