import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { fontes } from '../theme/fontes';

export function criarTemaNavegacao(cores, escuro) {
  const base = escuro ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: cores.primaria,
      background: cores.fundo,
      card: cores.superficie,
      text: cores.texto,
      border: cores.divisor,
    },
  };
}

export function opcoesCabecalho(cores) {
  return {
    headerStyle: { backgroundColor: cores.primaria },
    headerTintColor: cores.textoSobrePrimaria,
    headerTitleStyle: { fontFamily: fontes.seminegrito },
    headerBackButtonDisplayMode: 'minimal',
  };
}
