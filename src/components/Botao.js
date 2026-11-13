import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';
import Icone from './Icone';
import Texto from './Texto';

export default function Botao({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  carregando = false,
  desabilitado = false,
  style,
}) {
  const { cores } = useTema();
  const inativo = desabilitado || carregando;

  const aparencia = {
    primario: { fundo: cores.primaria, texto: cores.textoSobrePrimaria, borda: cores.primaria },
    secundario: { fundo: 'transparent', texto: cores.primaria, borda: cores.primaria },
    perigo: { fundo: cores.perigo, texto: '#FFFFFF', borda: cores.perigo },
  }[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      onPress={onPress}
      disabled={inativo}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: aparencia.fundo, borderColor: aparencia.borda },
        (pressed || inativo) && { opacity: 0.7 },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={aparencia.texto} />
      ) : (
        <View style={estilos.conteudo}>
          {icone ? <Icone nome={icone} tamanho={18} cor={aparencia.texto} /> : null}
          <Texto variante="destaque" cor={aparencia.texto}>
            {titulo}
          </Texto>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: 48,
    borderRadius: raios.md,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
