import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';
import { formatarPercentual } from '../utils/formatadores';
import Texto from './Texto';

// A barra enche conforme a escola se aproxima da meta (cheia = meta atingida)
export default function BarraMeta({ percentual, meta }) {
  const { cores } = useTema();
  const progresso = Math.min(Number(percentual) / Number(meta), 1);
  const atingiu = progresso >= 1;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${formatarPercentual(percentual)} comprado da agricultura familiar, meta de ${formatarPercentual(meta)}`}
      style={estilos.container}
    >
      <View style={[estilos.trilho, { backgroundColor: cores.divisor }]}>
        <View
          style={[
            estilos.preenchimento,
            {
              width: `${Math.max(progresso * 100, 2)}%`,
              backgroundColor: atingiu ? cores.sucesso : cores.destaque,
            },
          ]}
        />
      </View>
      <View style={estilos.legenda}>
        <Texto variante="destaque" cor={atingiu ? cores.sucesso : cores.texto}>
          {formatarPercentual(percentual)}
        </Texto>
        <Texto variante="legenda">meta: {formatarPercentual(meta)} da verba</Texto>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { marginVertical: 10 },
  trilho: { height: 12, borderRadius: raios.pilula, overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: raios.pilula },
  legenda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
});
