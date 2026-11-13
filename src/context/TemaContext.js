import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { coresClaras, coresEscuras } from '../theme/cores';

const CHAVE_TEMA = '@supernovacolheita:tema';

export const PREFERENCIAS_TEMA = ['sistema', 'claro', 'escuro'];

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const esquemaSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState('sistema');

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_TEMA)
      .then((salva) => {
        if (PREFERENCIAS_TEMA.includes(salva)) {
          setPreferencia(salva);
        }
      })
      .catch(() => {});
  }, []);

  const valor = useMemo(() => {
    const escuro = preferencia === 'sistema' ? esquemaSistema === 'dark' : preferencia === 'escuro';

    function alterarPreferencia(novaPreferencia) {
      setPreferencia(novaPreferencia);
      AsyncStorage.setItem(CHAVE_TEMA, novaPreferencia).catch(() => {});
    }

    return {
      cores: escuro ? coresEscuras : coresClaras,
      escuro,
      preferencia,
      alterarPreferencia,
    };
  }, [preferencia, esquemaSistema]);

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}
