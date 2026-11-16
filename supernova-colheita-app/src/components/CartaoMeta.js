import { StyleSheet, View } from 'react-native';

import { formatarMoeda } from '../utils/formatadores';
import { situacaoDaMeta } from '../utils/situacaoMeta';
import BarraMeta from './BarraMeta';
import Card from './Card';
import Etiqueta from './Etiqueta';
import LinhaInfo from './LinhaInfo';
import Texto from './Texto';

export default function CartaoMeta({ meta, detalhado = false }) {
  const situacao = situacaoDaMeta(meta.situacao);
  const falta = Number(meta.faltaParaMeta);

  return (
    <Card accessibilityLabel={`${meta.escola}: ${situacao.rotulo}`}>
      <View style={estilos.topo}>
        <View style={estilos.nome}>
          <Texto variante="destaque">{meta.escola}</Texto>
          <Texto variante="legenda">{meta.municipio}</Texto>
        </View>
        <Etiqueta texto={situacao.rotulo} tom={situacao.tom} icone={situacao.icone} />
      </View>

      <BarraMeta percentual={meta.percentual} meta={meta.metaPercentual} />

      {detalhado ? (
        <>
          <LinhaInfo
            icone="cash"
            rotulo="Verba do PNAE no ano"
            valor={formatarMoeda(meta.verbaPnaeAnual)}
          />
          <LinhaInfo
            icone="sprout-outline"
            rotulo="Comprado da agricultura familiar"
            valor={formatarMoeda(meta.valorComprado)}
          />
          <LinhaInfo
            icone="flag-checkered"
            rotulo="Falta para a meta"
            valor={falta > 0 ? formatarMoeda(falta) : 'Nada, meta cumprida'}
          />
        </>
      ) : (
        <Texto variante="legenda">
          {formatarMoeda(meta.valorComprado)} de {formatarMoeda(meta.verbaPnaeAnual)}
          {falta > 0 ? ` · faltam ${formatarMoeda(falta)}` : ''}
        </Texto>
      )}
    </Card>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  nome: { flex: 1 },
});
