import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { formatarDataHora, formatarMoeda } from '../utils/formatadores';
import Card from './Card';
import Etiqueta from './Etiqueta';
import Texto from './Texto';

export const STATUS_CARDAPIO = {
  SUGERIDO: { rotulo: 'Sugestão', tom: 'info', icone: 'lightbulb-outline' },
  CONVERTIDO: { rotulo: 'Virou pedido', tom: 'sucesso', icone: 'check' },
};

export default function CartaoCardapio({ cardapio, onPress }) {
  const { cores } = useTema();
  const status = STATUS_CARDAPIO[cardapio.status];
  const pratos = cardapio.dias.map((d) => d.prato).join(' · ');

  return (
    <Card onPress={onPress} accessibilityLabel={`Cardápio ${cardapio.id}`}>
      <View style={estilos.topo}>
        <Texto variante="destaque">Cardápio #{cardapio.id}</Texto>
        <Etiqueta texto={status.rotulo} tom={status.tom} icone={status.icone} />
      </View>
      <Texto variante="legenda">
        {cardapio.numeroAlunos} alunos · {cardapio.diasLetivos}{' '}
        {cardapio.diasLetivos === 1 ? 'dia' : 'dias'}
      </Texto>
      <Texto variante="legenda" numberOfLines={1}>
        {pratos}
      </Texto>
      <View style={estilos.rodape}>
        <Texto variante="legenda">{formatarDataHora(cardapio.dataCriacao)}</Texto>
        <Texto variante="destaque" cor={cardapio.dentroDoOrcamento ? cores.primaria : cores.perigo}>
          {formatarMoeda(cardapio.custoEstimado)}
        </Texto>
      </View>
    </Card>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
