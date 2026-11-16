import { StyleSheet, View } from 'react-native';

import { Botao, CartaoOferta, ListaPaginada } from '../components';
import { useMinhasOfertas } from '../hooks/useOfertas';

export default function MinhasOfertasScreen({ navigation }) {
  const consulta = useMinhasOfertas();

  return (
    <View style={estilos.tela}>
      <ListaPaginada
        consulta={consulta}
        itens={consulta.ofertas}
        mensagemVazia="Você ainda não cadastrou ofertas. Toque em Nova oferta para começar."
        cabecalho={
          <Botao
            titulo="Nova oferta"
            icone="plus"
            onPress={() => navigation.navigate('OfertaForm')}
            style={estilos.botao}
          />
        }
        renderItem={({ item }) => (
          <CartaoOferta
            oferta={item}
            mostrarProdutor={false}
            onPress={() => navigation.navigate('OfertaDetalhe', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  botao: { marginBottom: 16 },
});
