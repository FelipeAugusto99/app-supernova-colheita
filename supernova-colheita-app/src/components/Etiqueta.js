import { StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';
import Icone from './Icone';
import Texto from './Texto';

// tom: sucesso | alerta | perigo | info | neutro
export default function Etiqueta({ texto, tom = 'neutro', icone }) {
  const { cores } = useTema();
  const paleta = {
    sucesso: [cores.sucessoFundo, cores.sucesso],
    alerta: [cores.alertaFundo, cores.alerta],
    perigo: [cores.perigoFundo, cores.perigo],
    info: [cores.infoFundo, cores.info],
    neutro: [cores.divisor, cores.textoSecundario],
  };
  const [fundo, cor] = paleta[tom] ?? paleta.neutro;

  return (
    <View style={[estilos.etiqueta, { backgroundColor: fundo }]}>
      {icone ? <Icone nome={icone} tamanho={14} cor={cor} /> : null}
      <Texto variante="legenda" cor={cor} style={estilos.texto}>
        {texto}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: raios.pilula,
  },
  texto: { fontFamily: 'Poppins_500Medium' },
});
