import { CartaoPedido, ListaPaginada } from '../components';
import { useAuth } from '../context/AuthContext';
import { usePedidos } from '../hooks/usePedidos';

const mensagensVazias = {
  COMPRADOR: 'Você ainda não fez pedidos.',
  PRODUTOR: 'Nenhum pedido com seus produtos ainda.',
  GESTOR: 'Nenhum pedido registrado.',
};

export default function PedidosScreen({ navigation }) {
  const { usuario } = useAuth();
  const consulta = usePedidos();

  return (
    <ListaPaginada
      consulta={consulta}
      itens={consulta.pedidos}
      mensagemVazia={mensagensVazias[usuario.role]}
      renderItem={({ item }) => (
        <CartaoPedido
          pedido={item}
          onPress={() => navigation.navigate('PedidoDetalhe', { id: item.id })}
        />
      )}
    />
  );
}
