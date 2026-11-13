import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CartaoOferta, ListaPaginada, Opcoes } from '../components';
import { useOfertas } from '../hooks/useOfertas';
import { useProdutos } from '../hooks/useProdutos';

const TODOS = 'TODOS';

export default function OfertasScreen({ navigation }) {
  const [produtoId, setProdutoId] = useState(TODOS);
  const { data: produtos = [] } = useProdutos();

  const consulta = useOfertas({
    status: 'DISPONIVEL',
    produtoId: produtoId === TODOS ? undefined : produtoId,
  });

  const filtros = [
    { valor: TODOS, rotulo: 'Todos' },
    ...produtos.map((p) => ({ valor: p.id, rotulo: p.nome })),
  ];

  return (
    <View style={estilos.tela}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.filtros}
        style={estilos.barraFiltros}
      >
        <Opcoes
          opcoes={filtros}
          valor={produtoId}
          aoMudar={setProdutoId}
          style={estilos.semQuebra}
        />
      </ScrollView>

      <ListaPaginada
        consulta={consulta}
        itens={consulta.ofertas}
        mensagemVazia="Nenhuma oferta disponível para esse filtro."
        renderItem={({ item }) => (
          <CartaoOferta
            oferta={item}
            onPress={() => navigation.navigate('OfertaDetalhe', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  barraFiltros: { flexGrow: 0, flexShrink: 0, minHeight: 56 },
  filtros: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  semQuebra: { flexWrap: 'nowrap' },
});
