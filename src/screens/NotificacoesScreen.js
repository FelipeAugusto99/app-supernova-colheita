import { StyleSheet, View } from 'react-native';

import { Botao, CartaoNotificacao, ListaPaginada, Texto } from '../components';
import { useMarcarComoLida, useNotificacoes } from '../hooks/useNotificacoes';

export default function NotificacoesScreen({ navigation }) {
  const consulta = useNotificacoes();
  const marcarComoLida = useMarcarComoLida();
  const { notificacoes, naoLidas } = consulta;

  function abrir(notificacao) {
    if (!notificacao.lida) {
      marcarComoLida.mutate(notificacao.id);
    }
    if (notificacao.pedidoId) {
      navigation.navigate('PedidoDetalhe', { id: notificacao.pedidoId });
    }
  }

  function marcarTodas() {
    notificacoes.filter((n) => !n.lida).forEach((n) => marcarComoLida.mutate(n.id));
  }

  const cabecalho =
    notificacoes.length > 0 ? (
      <View style={estilos.cabecalho}>
        <Texto variante="legenda" style={estilos.resumo}>
          {naoLidas > 0
            ? `${naoLidas} ${naoLidas === 1 ? 'notificação não lida' : 'notificações não lidas'}`
            : 'Tudo lido por aqui.'}
        </Texto>
        {naoLidas > 0 ? (
          <Botao
            titulo="Marcar todas como lidas"
            icone="check-all"
            variante="secundario"
            onPress={marcarTodas}
          />
        ) : null}
      </View>
    ) : null;

  return (
    <ListaPaginada
      consulta={consulta}
      itens={notificacoes}
      cabecalho={cabecalho}
      mensagemVazia="Nenhuma notificação ainda. Os avisos de pedidos aparecem aqui."
      renderItem={({ item }) => (
        <CartaoNotificacao notificacao={item} onPress={() => abrir(item)} />
      )}
    />
  );
}

const estilos = StyleSheet.create({
  cabecalho: { marginBottom: 12, gap: 8 },
  resumo: { textAlign: 'center' },
});
