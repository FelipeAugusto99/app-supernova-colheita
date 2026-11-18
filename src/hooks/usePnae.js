import { useQuery } from '@tanstack/react-query';

import { buscarMinhaMeta, listarMetas } from '../services/pnaeService';

export function useMinhaMeta(ano, habilitado = true) {
  return useQuery({
    queryKey: ['meta-pnae', 'minha', ano],
    queryFn: () => buscarMinhaMeta(ano),
    enabled: habilitado,
  });
}

export function useMetas(ano, habilitado = true) {
  return useQuery({
    queryKey: ['meta-pnae', 'todas', ano],
    queryFn: () => listarMetas(ano),
    enabled: habilitado,
  });
}
