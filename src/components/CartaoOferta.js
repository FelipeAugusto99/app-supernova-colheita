import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { diasAteVencer, formatarQuantidade, precoPorUnidade } from '../utils/formatadores';
import { iconesCategoria, STATUS_OFERTA } from '../utils/statusOferta';
import Card from './Card';
import Etiqueta from './Etiqueta';
import Icone from './Icone';
import Texto from './Texto';

function textoValidade(oferta) {
  const dias = diasAteVencer(oferta.dataValidade);
  if (dias < 0) return 'Validade vencida';
  if (dias === 0) return 'Vence hoje';
  return dias === 1 ? 'Vence amanhã' : `Vence em ${dias} dias`;
}

export default function CartaoOferta({ oferta, onPress, mostrarProdutor = true }) {
  const { cores } = useTema();
  const status = STATUS_OFERTA[oferta.status];
  const venceLogo = oferta.status === 'DISPONIVEL' && diasAteVencer(oferta.dataValidade) <= 2;

  return (
    <Card onPress={onPress} accessibilityLabel={`Oferta de ${oferta.produtoNome}`}>
      <View style={estilos.topo}>
        <View style={[estilos.icone, { backgroundColor: cores.superficieDestaque }]}>
          <Icone nome={iconesCategoria[oferta.categoria]} cor={cores.primaria} />
        </View>
        <View style={estilos.titulos}>
          <Texto variante="destaque">{oferta.produtoNome}</Texto>
          {mostrarProdutor ? (
            <Texto variante="legenda" numberOfLines={1}>
              {oferta.produtorNome} · {oferta.municipio}/{oferta.uf}
            </Texto>
          ) : null}
        </View>
        <Etiqueta texto={status.rotulo} tom={status.tom} />
      </View>

      <View style={estilos.rodape}>
        <Texto variante="destaque" cor={cores.primaria}>
          {precoPorUnidade(oferta.precoUnitario, oferta.unidade)}
        </Texto>
        <Texto variante="legenda">
          {formatarQuantidade(oferta.qtdDisponivel, oferta.unidade)} disponíveis
        </Texto>
      </View>
      <Texto variante="legenda" cor={venceLogo ? cores.alerta : undefined}>
        {textoValidade(oferta)}
      </Texto>
    </Card>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulos: { flex: 1 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
});
