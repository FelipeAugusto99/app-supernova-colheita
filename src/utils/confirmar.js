import { Alert, Platform } from 'react-native';

// Pede confirmacao antes de uma acao destrutiva (no navegador usa window.confirm)
export function confirmar({ titulo, mensagem, textoConfirmar = 'Confirmar' }) {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolver) => {
    Alert.alert(titulo, mensagem, [
      { text: 'Voltar', style: 'cancel', onPress: () => resolver(false) },
      { text: textoConfirmar, style: 'destructive', onPress: () => resolver(true) },
    ]);
  });
}
