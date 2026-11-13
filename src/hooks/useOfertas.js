import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  atualizarOferta,
  buscarOferta,
  cancelarOferta,
  criarOferta,
  listarMinhasOfertas,
  listarOfertas,
} from '../services/ofertasService';

// A API devolve { content, page: { number, totalPages } }; aqui juntamos as paginas
function proximaPagina(ultima) {
  const { number, totalPages } = ultima.page;
  return number + 1 < totalPages ? number + 1 : undefined;
}

function juntarPaginas(dados) {
  return dados?.pages.flatMap((pagina) => pagina.content) ?? [];
}

export function useOfertas(filtros) {
  const consulta = useInfiniteQuery({
    queryKey: ['ofertas', filtros],
    queryFn: ({ pageParam }) => listarOfertas({ ...filtros, pagina: pageParam }),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });
  return { ...consulta, ofertas: juntarPaginas(consulta.data) };
}

export function useMinhasOfertas() {
  const consulta = useInfiniteQuery({
    queryKey: ['ofertas', 'minhas'],
    queryFn: ({ pageParam }) => listarMinhasOfertas({ pagina: pageParam }),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });
  return { ...consulta, ofertas: juntarPaginas(consulta.data) };
}

export function useOferta(id) {
  return useQuery({ queryKey: ['oferta', id], queryFn: () => buscarOferta(id) });
}

export function useSalvarOferta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, oferta }) => (id ? atualizarOferta(id, oferta) : criarOferta(oferta)),
    onSuccess: (ofertaSalva) => {
      queryClient.setQueryData(['oferta', ofertaSalva.id], ofertaSalva);
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
    },
  });
}

export function useCancelarOferta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => cancelarOferta(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['oferta', id] });
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
    },
  });
}
