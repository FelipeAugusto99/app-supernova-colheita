import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from './src/config/queryClient';
import { AuthProvider } from './src/context/AuthContext';
import { CarrinhoProvider } from './src/context/CarrinhoContext';
import { TemaProvider } from './src/context/TemaContext';
import AppNavigator from './src/navigation/AppNavigator';
import { arquivosFontes } from './src/theme/fontes';

SplashScreen.preventAutoHideAsync().catch(() => {});

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
          <AuthProvider>
            <CarrinhoProvider>
              <AppNavigator />
            </CarrinhoProvider>
          </AuthProvider>
        </TemaProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
