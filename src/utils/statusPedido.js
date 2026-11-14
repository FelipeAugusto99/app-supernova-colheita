export const STATUS_PEDIDO = {
  PENDENTE: { rotulo: 'Pendente', tom: 'alerta', icone: 'clock-outline' },
  CONFIRMADO: { rotulo: 'Confirmado', tom: 'info', icone: 'check' },
  ENTREGUE: { rotulo: 'Entregue', tom: 'sucesso', icone: 'truck-check-outline' },
  CANCELADO: { rotulo: 'Cancelado', tom: 'neutro', icone: 'close-circle-outline' },
};

// Mesmas regras da API: o produtor confirma e entrega, o comprador cancela, o gestor faz tudo
export function acoesDoPedido(pedido, usuario) {
  const { status } = pedido;
  const gestor = usuario.role === 'GESTOR';
  const produtor = usuario.role === 'PRODUTOR';
  const comprador = usuario.role === 'COMPRADOR';
  const acoes = [];

  if ((produtor || gestor) && status === 'PENDENTE') {
    acoes.push({
      status: 'CONFIRMADO',
      titulo: 'Confirmar pedido',
      icone: 'check',
      variante: 'primario',
    });
  }
  if ((produtor || gestor) && status === 'CONFIRMADO') {
    acoes.push({
      status: 'ENTREGUE',
      titulo: 'Marcar como entregue',
      icone: 'truck-check-outline',
      variante: 'primario',
    });
  }
  if ((comprador || gestor) && (status === 'PENDENTE' || status === 'CONFIRMADO')) {
    acoes.push({
      status: 'CANCELADO',
      titulo: 'Cancelar pedido',
      icone: 'close-circle-outline',
      variante: 'perigo',
    });
  }
  return acoes;
}
