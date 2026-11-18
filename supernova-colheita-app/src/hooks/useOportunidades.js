import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  buscarOportunidade,
  criarOportunidade,
  excluirOportunidade,
  listarOportunidades,
} from '../services/oportunidadesService';

// Abertas primeiro, ordenadas pelo prazo de inscricao mais proximo
function ordenar(lista) {
  return [...lista].sort((a, b) => {
    if (a.ativa !== b.ativa) {
      return a.ativa ? -1 : 1;
    }
    return a.prazoInscricao.localeCompare(b.prazoInscricao);
  });
}

export function useOportunidades() {
  return useQuery({ queryKey: ['oportunidades'], queryFn: listarOportunidades, select: ordenar });
}

export function useOportunidade(id) {
  return useQuery({ queryKey: ['oportunidade', id], queryFn: () => buscarOportunidade(id) });
}

export function useCriarOportunidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarOportunidade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['oportunidades'] }),
  });
}

export function useExcluirOportunidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: excluirOportunidade,
    onSuccess: (_resultado, id) => {
      queryClient.removeQueries({ queryKey: ['oportunidade', id] });
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
    },
  });
}
