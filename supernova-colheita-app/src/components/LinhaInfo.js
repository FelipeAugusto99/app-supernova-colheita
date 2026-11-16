import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import Icone from './Icone';
import Texto from './Texto';

export default function LinhaInfo({ icone, rotulo, valor }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.linha, { borderBottomColor: cores.divisor }]}>
      <Icone nome={icone} tamanho={20} cor={cores.primaria} />
      <Texto variante="legenda" style={estilos.rotulo}>
        {rotulo}
      </Texto>
      <Texto variante="destaque" style={estilos.valor}>
        {valor}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rotulo: { flex: 1 },
  valor: { flexShrink: 1, textAlign: 'right' },
});
