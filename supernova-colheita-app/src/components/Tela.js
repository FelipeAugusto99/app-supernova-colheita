import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTema } from '../context/TemaContext';

// Estrutura padrao das telas: fundo do tema, area segura e rolagem com teclado
export default function Tela({ children, rolavel = true, comCabecalho = true, style }) {
  const { cores } = useTema();
  const bordas = comCabecalho ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right'];

  return (
    <SafeAreaView edges={bordas} style={[estilos.area, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView
        style={estilos.area}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {rolavel ? (
          <ScrollView
            contentContainerStyle={[estilos.conteudo, style]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[estilos.area, style]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  area: { flex: 1 },
  conteudo: { flexGrow: 1, padding: 20 },
});
