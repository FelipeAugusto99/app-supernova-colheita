import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTema } from '../context/TemaContext';

// Recebe uma funcao (cores) => estilos e devolve o StyleSheet do tema atual
export function useEstilos(criarEstilos) {
  const { cores } = useTema();
  return useMemo(() => StyleSheet.create(criarEstilos(cores)), [cores, criarEstilos]);
}
