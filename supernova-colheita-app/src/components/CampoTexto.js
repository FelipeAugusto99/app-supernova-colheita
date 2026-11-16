import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';
import { fontes } from '../theme/fontes';
import Icone from './Icone';
import Texto from './Texto';

export default function CampoTexto({
  rotulo,
  erro,
  senha = false,
  multiline = false,
  style,
  ...props
}) {
  const { cores } = useTema();
  const [focado, setFocado] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const corBorda = erro ? cores.perigo : focado ? cores.primaria : cores.borda;

  return (
    <View style={[estilos.container, style]}>
      {rotulo ? (
        <Texto variante="destaque" style={estilos.rotulo}>
          {rotulo}
        </Texto>
      ) : null}

      <View
        style={[
          estilos.caixa,
          multiline && estilos.caixaMultilinha,
          { borderColor: corBorda, backgroundColor: cores.superficie },
        ]}
      >
        <TextInput
          accessibilityLabel={rotulo}
          placeholderTextColor={cores.textoTerciario}
          secureTextEntry={senha && !mostrarSenha}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          multiline={multiline}
          style={[estilos.entrada, multiline && estilos.entradaMultilinha, { color: cores.texto }]}
          {...props}
        />
        {senha ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setMostrarSenha((atual) => !atual)}
            hitSlop={10}
          >
            <Icone
              nome={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
              cor={cores.textoSecundario}
            />
          </Pressable>
        ) : null}
      </View>

      {erro ? (
        <Texto variante="legenda" cor={cores.perigo} style={estilos.erro}>
          {erro}
        </Texto>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { marginBottom: 14 },
  rotulo: { marginBottom: 6 },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: raios.md,
    paddingHorizontal: 14,
  },
  entrada: {
    flex: 1,
    minHeight: 48,
    fontFamily: fontes.regular,
    fontSize: 15,
  },
  caixaMultilinha: { alignItems: 'stretch', paddingVertical: 10 },
  entradaMultilinha: {
    minHeight: 96,
    textAlignVertical: 'top',
    // no navegador o campo de varias linhas ganha um contorno proprio ao focar
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  erro: { marginTop: 4 },
});
