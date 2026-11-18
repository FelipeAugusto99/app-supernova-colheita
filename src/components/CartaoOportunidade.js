import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { diasAteVencer, formatarData, formatarMoeda } from '../utils/formatadores';
import Card from './Card';
import Etiqueta from './Etiqueta';
import Icone from './Icone';
import Texto from './Texto';

export function situacaoDoPrazo(oportunidade) {
  const dias = diasAteVencer(oportunidade.prazoInscricao);
  if (!oportunidade.ativa || dias < 0) {
    return { rotulo: 'Encerrada', tom: 'neutro', icone: 'lock-outline' };
  }
  if (dias === 0) {
    return { rotulo: 'Encerra hoje', tom: 'perigo', icone: 'alarm' };
  }
  if (dias <= 7) {
    return {
      rotulo: `Faltam ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
      tom: 'alerta',
      icone: 'alarm',
    };
  }
  return { rotulo: 'Inscrições abertas', tom: 'sucesso', icone: 'door-open' };
}

export default function CartaoOportunidade({ oportunidade, onPress }) {
  const { cores } = useTema();
  const situacao = situacaoDoPrazo(oportunidade);

  return (
    <Card onPress={onPress} accessibilityLabel={oportunidade.titulo}>
      <Etiqueta texto={situacao.rotulo} tom={situacao.tom} icone={situacao.icone} />
      <Texto variante="destaque" style={estilos.titulo}>
        {oportunidade.titulo}
      </Texto>
      <Texto variante="legenda">{oportunidade.instituicao}</Texto>
      <View style={estilos.rodape}>
        <View style={estilos.local}>
          <Icone nome="map-marker-outline" tamanho={16} cor={cores.textoSecundario} />
          <Texto variante="legenda">
            {oportunidade.municipio}/{oportunidade.estado} · até{' '}
            {formatarData(oportunidade.prazoInscricao)}
          </Texto>
        </View>
        <Texto variante="destaque" cor={cores.primaria}>
          {formatarMoeda(oportunidade.valorEstimado)}
        </Texto>
      </View>
    </Card>
  );
}

const estilos = StyleSheet.create({
  titulo: { marginTop: 8 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  local: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
});
