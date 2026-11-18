import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { formatarDataHora } from '../utils/formatadores';
import Card from './Card';
import Icone from './Icone';
import Texto from './Texto';

export default function CartaoNotificacao({ notificacao, onPress }) {
  const { cores } = useTema();
  const { lida } = notificacao;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${lida ? '' : 'Não lida. '}${notificacao.titulo}`}
      style={[estilos.card, !lida && { borderColor: cores.primaria }]}
    >
      <View
        style={[
          estilos.icone,
          { backgroundColor: lida ? cores.divisor : cores.superficieDestaque },
        ]}
      >
        <Icone
          nome={lida ? 'bell-outline' : 'bell-ring-outline'}
          tamanho={22}
          cor={lida ? cores.textoTerciario : cores.primaria}
        />
      </View>
      <View style={estilos.textos}>
        <Texto variante="destaque" cor={lida ? cores.textoSecundario : cores.texto}>
          {notificacao.titulo}
        </Texto>
        <Texto variante="legenda">{notificacao.mensagem}</Texto>
        <Texto variante="legenda" cor={cores.textoTerciario} style={estilos.data}>
          {formatarDataHora(notificacao.dataCriacao)}
        </Texto>
      </View>
      {!lida ? <View style={[estilos.ponto, { backgroundColor: cores.destaque }]} /> : null}
    </Card>
  );
}

const estilos = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12 },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
  data: { marginTop: 4 },
  ponto: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
});
