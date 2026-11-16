// Regras do carrinho, sem React: facil de testar e de reaproveitar

const arredondar = (valor) => Math.round(valor * 100) / 100;

export function adicionarItem(itens, oferta, quantidade) {
  const existente = itens.find((item) => item.oferta.id === oferta.id);
  if (existente) {
    return alterarQuantidade(itens, oferta.id, existente.quantidade + quantidade);
  }
  return [...itens, { oferta, quantidade: Math.min(quantidade, oferta.qtdDisponivel) }];
}

export function alterarQuantidade(itens, ofertaId, quantidade) {
  return itens
    .map((item) =>
      item.oferta.id === ofertaId
        ? { ...item, quantidade: Math.min(Math.max(quantidade, 0), item.oferta.qtdDisponivel) }
        : item
    )
    .filter((item) => item.quantidade > 0);
}

export function removerItem(itens, ofertaId) {
  return itens.filter((item) => item.oferta.id !== ofertaId);
}

export const subtotal = (item) => arredondar(item.quantidade * item.oferta.precoUnitario);

export const totalDoCarrinho = (itens) =>
  arredondar(itens.reduce((soma, item) => soma + subtotal(item), 0));

// formato que a API espera em POST /pedidos
export const itensParaPedido = (itens) =>
  itens.map((item) => ({ ofertaId: item.oferta.id, quantidade: item.quantidade }));
