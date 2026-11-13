import { Pressable, StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';
import Texto from './Texto';

// Grupo de opcoes em formato de "pilulas" (escolha unica)
export default function Opcoes({ opcoes, valor, aoMudar, style }) {
  const { cores } = useTema();

  return (
    <View style={[estilos.grupo, style]} accessibilityRole="radiogroup">
      {opcoes.map((opcao) => {
        const selecionada = opcao.valor === valor;
        return (
          <Pressable
            key={opcao.valor}
            accessibilityRole="radio"
            accessibilityState={{ checked: selecionada }}
            onPress={() => aoMudar(opcao.valor)}
            style={[
              estilos.opcao,
              {
                backgroundColor: selecionada ? cores.primaria : cores.superficie,
                borderColor: selecionada ? cores.primaria : cores.borda,
              },
            ]}
          >
            <Texto
              variante="destaque"
              cor={selecionada ? cores.textoSobrePrimaria : cores.textoSecundario}
            >
              {opcao.rotulo}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: raios.pilula,
    borderWidth: 1.5,
  },
});
