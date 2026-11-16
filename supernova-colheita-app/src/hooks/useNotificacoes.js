import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { listarNotificacoes, marcarComoLida } from '../services/notificacoesService';

// As notificacoes chegam pela fila do RabbitMQ: a lista e atualizada a cada 30 segundos
export function useNotificacoes() {
  const consulta = useInfiniteQuery({
    queryKey: ['notificacoes'],
    queryFn: ({ pageParam }) => listarNotificacoes({ pagina: pageParam }),
    initialPageParam: 0,
    getNextPageParam: ({ page }) =>
      page.number + 1 < page.totalPages ? page.number + 1 : undefined,
    refetchInterval: 30000,
  });
  const notificacoes = consulta.data?.pages.flatMap((p) => p.content) ?? [];
  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  return { ...consulta, notificacoes, naoLidas };
}

// Marca como lida na hora (sem esperar a API) e desfaz se a chamada falhar
export function useMarcarComoLida() {
  const queryClient = useQueryClient();
  const trocarLida = (id, lida) =>
    queryClient.setQueryData(['notificacoes'], (dados) =>
      dados
        ? {
            ...dados,
            pages: dados.pages.map((pagina) => ({
              ...pagina,
              content: pagina.content.map((n) => (n.id === id ? { ...n, lida } : n)),
            })),
          }
        : dados
    );

  return useMutation({
    mutationFn: marcarComoLida,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notificacoes'] });
      trocarLida(id, true);
    },
    onError: (_erro, id) => trocarLida(id, false),
  });
}
