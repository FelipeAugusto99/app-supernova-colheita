import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';
import { fontes } from '../theme/fontes';
import Icone from './Icone';

export default function SeletorQuantidade({ valor, aoMudar, maximo, rotulo = 'Quantidade' }) {
  const { cores } = useTema();
  const mudar = (novo) => aoMudar(Math.min(Math.max(novo, 0), maximo ?? Infinity));

  function digitar(texto) {
    const numero = Number(texto.replace(',', '.'));
    if (!Number.isNaN(numero)) {
      mudar(numero);
    }
  }

  const botao = (icone, descricao, onPress, desabilitado) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={descricao}
      onPress={onPress}
      disabled={desabilitado}
      style={[estilos.botao, { borderColor: cores.borda, opacity: desabilitado ? 0.4 : 1 }]}
    >
      <Icone nome={icone} tamanho={20} cor={cores.primaria} />
    </Pressable>
  );

  return (
    <View style={estilos.linha}>
      {botao('minus', `Diminuir ${rotulo.toLowerCase()}`, () => mudar(valor - 1), valor <= 0)}
      <TextInput
        accessibilityLabel={rotulo}
        value={String(valor)}
        onChangeText={digitar}
        keyboardType="decimal-pad"
        style={[
          estilos.entrada,
          { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.superficie },
        ]}
      />
      {botao('plus', `Aumentar ${rotulo.toLowerCase()}`, () => mudar(valor + 1), valor >= maximo)}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  botao: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderRadius: raios.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entrada: {
    width: 72,
    height: 40,
    borderWidth: 1.5,
    borderRadius: raios.md,
    textAlign: 'center',
    fontFamily: fontes.seminegrito,
    fontSize: 15,
  },
});
