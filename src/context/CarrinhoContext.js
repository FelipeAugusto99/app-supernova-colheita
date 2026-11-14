import { createContext, useContext, useMemo, useState } from 'react';

import { adicionarItem, alterarQuantidade, removerItem, totalDoCarrinho } from '../utils/carrinho';
import { useAuth } from './AuthContext';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id ?? null;

  // O carrinho guarda de quem ele e: ao sair ou trocar de usuario, aparece vazio
  const [carrinho, setCarrinho] = useState({ dono: null, itens: [] });
  const valor = useMemo(() => {
    const itens = carrinho.dono === usuarioId ? carrinho.itens : [];
    const atualizar = (alterarItens) =>
      setCarrinho((atual) => ({
        dono: usuarioId,
        itens: alterarItens(atual.dono === usuarioId ? atual.itens : []),
      }));

    return {
      itens,
      quantidadeItens: itens.length,
      total: totalDoCarrinho(itens),
      adicionar: (oferta, quantidade) =>
        atualizar((lista) => adicionarItem(lista, oferta, quantidade)),
      alterar: (ofertaId, quantidade) =>
        atualizar((lista) => alterarQuantidade(lista, ofertaId, quantidade)),
      remover: (ofertaId) => atualizar((lista) => removerItem(lista, ofertaId)),
      limpar: () => atualizar(() => []),
    };
  }, [carrinho, usuarioId]);

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
