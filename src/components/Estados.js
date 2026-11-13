import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import Botao from './Botao';
import Icone from './Icone';
import Texto from './Texto';

export function Carregando({ mensagem = 'Carregando...' }) {
  const { cores } = useTema();
  return (
    <View style={estilos.centro}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Texto variante="legenda" style={estilos.texto}>
        {mensagem}
      </Texto>
    </View>
  );
}

export function MensagemErro({ mensagem, onTentarNovamente }) {
  const { cores } = useTema();
  return (
    <View style={estilos.centro}>
      <Icone nome="alert-circle-outline" tamanho={44} cor={cores.perigo} />
      <Texto style={estilos.texto}>{mensagem}</Texto>
      {onTentarNovamente ? (
        <Botao titulo="Tentar novamente" variante="secundario" onPress={onTentarNovamente} />
      ) : null}
    </View>
  );
}

export function ListaVazia({ icone = 'sprout-outline', mensagem }) {
  const { cores } = useTema();
  return (
    <View style={estilos.centro}>
      <Icone nome={icone} tamanho={44} cor={cores.textoTerciario} />
      <Texto variante="legenda" style={estilos.texto}>
        {mensagem}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  texto: { textAlign: 'center' },
});
