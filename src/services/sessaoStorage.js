import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SESSAO = '@supernovacolheita:sessao';

export async function salvarSessao(sessao) {
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export async function carregarSessao() {
  const valor = await AsyncStorage.getItem(CHAVE_SESSAO);
  return valor ? JSON.parse(valor) : null;
}

export async function removerSessao() {
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}
