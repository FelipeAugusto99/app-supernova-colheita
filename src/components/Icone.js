import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTema } from '../context/TemaContext';

export default function Icone({ nome, tamanho = 22, cor }) {
  const { cores } = useTema();
  return <MaterialCommunityIcons name={nome} size={tamanho} color={cor ?? cores.texto} />;
}
