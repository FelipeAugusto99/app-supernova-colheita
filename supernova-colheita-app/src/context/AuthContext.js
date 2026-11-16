import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { definirToken, limparToken, registrarInterceptadorNaoAutorizado } from '../services/api';
import {
  autenticar,
  buscarUsuarioLogado,
  registrarComprador,
  registrarProdutor,
} from '../services/authService';
import { carregarSessao, removerSessao, salvarSessao } from '../services/sessaoStorage';

const AuthContext = createContext(null);

function sessaoExpirada(sessao) {
  return !sessao?.expiraEm || new Date(sessao.expiraEm).getTime() <= Date.now();
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  const sair = useCallback(async () => {
    limparToken();
    setUsuario(null);
    queryClient.clear();
    await removerSessao();
  }, [queryClient]);

  // Ao abrir o app, recupera a sessao salva e confere se o token ainda vale
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const sessao = await carregarSessao();
        if (!sessao || sessaoExpirada(sessao)) {
          await removerSessao();
          return;
        }
        definirToken(sessao.token);
        setUsuario(sessao.usuario);
        const atualizado = await buscarUsuarioLogado();
        setUsuario(atualizado);
      } catch (erro) {
        if (erro?.response?.status === 401) {
          await sair();
        }
      } finally {
        setCarregandoSessao(false);
      }
    }

    restaurarSessao();
  }, [sair]);

  useEffect(() => registrarInterceptadorNaoAutorizado(sair), [sair]);

  const valor = useMemo(() => {
    async function aplicarSessao(resposta) {
      const sessao = {
        token: resposta.token,
        expiraEm: resposta.expiraEm,
        usuario: resposta.usuario,
      };
      definirToken(sessao.token);
      await salvarSessao(sessao);
      setUsuario(sessao.usuario);
    }

    return {
      usuario,
      carregandoSessao,
      async entrar(email, senha) {
        await aplicarSessao(await autenticar(email.trim(), senha));
      },
      async cadastrar(tipoConta, dados) {
        const registrar = tipoConta === 'PRODUTOR' ? registrarProdutor : registrarComprador;
        await aplicarSessao(await registrar(dados));
      },
      sair,
    };
  }, [usuario, carregandoSessao, sair]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
