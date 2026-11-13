import { Text } from 'react-native';

import { useTema } from '../context/TemaContext';
import { fontes } from '../theme/fontes';

const variantes = {
  titulo: { fontFamily: fontes.negrito, fontSize: 24, lineHeight: 32 },
  subtitulo: { fontFamily: fontes.seminegrito, fontSize: 18, lineHeight: 26 },
  corpo: { fontFamily: fontes.regular, fontSize: 15, lineHeight: 22 },
  destaque: { fontFamily: fontes.seminegrito, fontSize: 15, lineHeight: 22 },
  legenda: { fontFamily: fontes.regular, fontSize: 13, lineHeight: 18 },
};

export default function Texto({ variante = 'corpo', cor, style, children, ...props }) {
  const { cores } = useTema();
  const corPadrao = variante === 'legenda' ? cores.textoSecundario : cores.texto;

  return (
    <Text style={[variantes[variante], { color: cor ?? corPadrao }, style]} {...props}>
      {children}
    </Text>
  );
}
