import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AvisoErro,
  Botao,
  Card,
  Icone,
  ListaVazia,
  SeletorQuantidade,
  Tela,
  Texto,
} from '../components';
import { useCarrinho } from '../context/CarrinhoContext';
import { useTema } from '../context/TemaContext';
import { useCriarPedido } from '../hooks/usePedidos';
import { itensParaPedido, subtotal } from '../utils/carrinho';
import { mensagemDeErro } from '../utils/erros';
import { formatarMoeda, nomesUnidades, precoPorUnidade } from '../utils/formatadores';

export default function CarrinhoScreen({ navigation }) {
  const { cores } = useTema();
  const { itens, total, alterar, remover, limpar } = useCarrinho();
  const criarPedido = useCriarPedido();
  const [erro, setErro] = useState('');

  if (itens.length === 0) {
    return (
      <Tela>
        <ListaVazia
          icone="cart-outline"
          mensagem="Seu pedido está vazio. Escolha produtos em Ofertas da região."
        />
        <Botao
          titulo="Ver ofertas"
          icone="basket-outline"
          onPress={() => navigation.navigate('Ofertas')}
        />
      </Tela>
    );
  }

  function finalizar() {
    setErro('');
    criarPedido.mutate(itensParaPedido(itens), {
      onSuccess: (pedido) => {
        limpar();
        navigation.replace('PedidoDetalhe', { id: pedido.id, recemCriado: true });
      },
      onError: (falha) => setErro(mensagemDeErro(falha, 'Não foi possível finalizar o pedido.')),
    });
  }

  return (
    <Tela>
      <AvisoErro mensagem={erro} />

      {itens.map((item) => (
        <Card key={item.oferta.id}>
          <View style={estilos.topo}>
            <View style={estilos.titulos}>
              <Texto variante="destaque">{item.oferta.produtoNome}</Texto>
              <Texto variante="legenda">{item.oferta.produtorNome}</Texto>
              <Texto variante="legenda">
                {precoPorUnidade(item.oferta.precoUnitario, item.oferta.unidade)}
              </Texto>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover ${item.oferta.produtoNome}`}
              onPress={() => remover(item.oferta.id)}
              hitSlop={10}
            >
              <Icone nome="trash-can-outline" cor={cores.perigo} />
            </Pressable>
          </View>
          <View style={estilos.rodape}>
            <SeletorQuantidade
              valor={item.quantidade}
              maximo={item.oferta.qtdDisponivel}
              aoMudar={(quantidade) => alterar(item.oferta.id, quantidade)}
              rotulo={`Quantidade de ${item.oferta.produtoNome} em ${nomesUnidades[item.oferta.unidade]}`}
            />
            <Texto variante="destaque" cor={cores.primaria}>
              {formatarMoeda(subtotal(item))}
            </Texto>
          </View>
        </Card>
      ))}

      <View style={[estilos.total, { borderTopColor: cores.borda }]}>
        <Texto variante="subtitulo">Total</Texto>
        <Texto variante="subtitulo" cor={cores.primaria}>
          {formatarMoeda(total)}
        </Texto>
      </View>

      <Botao
        titulo="Finalizar pedido"
        icone="check-circle-outline"
        onPress={finalizar}
        carregando={criarPedido.isPending}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  titulos: { flex: 1 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 16,
    marginBottom: 16,
  },
});
