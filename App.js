import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Texto } from './src/components';
import { queryClient } from './src/config/queryClient';
import { TemaProvider, useTema } from './src/context/TemaContext';
import { arquivosFontes } from './src/theme/fontes';

SplashScreen.preventAutoHideAsync().catch(() => {});

function BoasVindas() {
  const { cores, escuro } = useTema();

  return (
    <View style={[estilos.container, { backgroundColor: cores.fundo }]}>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <Image source={require('./assets/images/logo.png')} style={estilos.logo} />
      <Texto variante="titulo">Supernova Colheita</Texto>
      <Texto variante="legenda">Da agricultura familiar para a merenda escolar</Texto>
    </View>
  );
}

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts(arquivosFontes);

  useEffect(() => {
    if (fontesCarregadas || erroFontes) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontesCarregadas, erroFontes]);

  if (!fontesCarregadas && !erroFontes) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <TemaProvider>
          <BoasVindas />
        </TemaProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  logo: { width: 120, height: 120, marginBottom: 8 },
});
