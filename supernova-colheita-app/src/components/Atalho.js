import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import Card from './Card';
import Icone from './Icone';
import Texto from './Texto';

export default function Atalho({ icone, titulo, descricao, onPress }) {
  const { cores } = useTema();
  return (
    <Card onPress={onPress} style={estilos.card} accessibilityLabel={titulo}>
      <View style={[estilos.icone, { backgroundColor: cores.superficieDestaque }]}>
        <Icone nome={icone} tamanho={26} cor={cores.primaria} />
      </View>
      <View style={estilos.textos}>
        <Texto variante="destaque">{titulo}</Texto>
        <Texto variante="legenda">{descricao}</Texto>
      </View>
      <Icone nome="chevron-right" cor={cores.textoTerciario} />
    </Card>
  );
}

const estilos = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icone: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
});
