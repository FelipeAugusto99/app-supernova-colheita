import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { formatarDataHora, formatarMoeda } from '../utils/formatadores';
import { STATUS_PEDIDO } from '../utils/statusPedido';
import Card from './Card';
import Etiqueta from './Etiqueta';
import Texto from './Texto';

export default function CartaoPedido({ pedido, onPress }) {
  const { cores } = useTema();
  const status = STATUS_PEDIDO[pedido.status];
  const produtos = pedido.itens.map((item) => item.produtoNome).join(', ');

  return (
    <Card onPress={onPress} accessibilityLabel={`Pedido ${pedido.id}`}>
      <View style={estilos.topo}>
        <Texto variante="destaque">Pedido #{pedido.id}</Texto>
        <Etiqueta texto={status.rotulo} tom={status.tom} icone={status.icone} />
      </View>
      <Texto variante="legenda">{pedido.compradorNome}</Texto>
      <Texto variante="legenda" numberOfLines={1}>
        {produtos}
      </Texto>
      <View style={estilos.rodape}>
        <Texto variante="legenda">{formatarDataHora(pedido.dataPedido)}</Texto>
        <Texto variante="destaque" cor={cores.primaria}>
          {formatarMoeda(pedido.valorTotal)}
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
