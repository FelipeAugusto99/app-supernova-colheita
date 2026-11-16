import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { mensagemDeErro } from '../utils/erros';
import { Carregando, ListaVazia, MensagemErro } from './Estados';

// Lista com "puxar para atualizar", carregamento das proximas paginas e estados de erro/vazio
export default function ListaPaginada({ consulta, itens, renderItem, mensagemVazia, cabecalho }) {
  const { cores } = useTema();
  const { isLoading, isError, error, refetch, isRefetching } = consulta;
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = consulta;

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  return (
    <FlatList
      data={itens}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={estilos.conteudo}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={<ListaVazia mensagem={mensagemVazia} />}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={estilos.rodape}>
            <ActivityIndicator color={cores.primaria} />
          </View>
        ) : null
      }
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={refetch}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, padding: 16 },
  rodape: { padding: 16 },
});
