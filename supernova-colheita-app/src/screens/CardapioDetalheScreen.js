import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AvisoErro,
  Botao,
  Card,
  Carregando,
  Etiqueta,
  Icone,
  LinhaInfo,
  MensagemErro,
  STATUS_CARDAPIO,
  Tela,
  Texto,
} from '../components';
import { useTema } from '../context/TemaContext';
import { useCardapio, useConverterEmPedido, useExcluirCardapio } from '../hooks/useCardapios';
import { confirmar } from '../utils/confirmar';
import { mensagemDeErro } from '../utils/erros';
import { formatarDataHora, formatarMoeda, formatarQuantidade } from '../utils/formatadores';

export default function CardapioDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { cores } = useTema();
  const { data: cardapio, isLoading, isError, error, refetch } = useCardapio(id);
  const converter = useConverterEmPedido();
  const excluir = useExcluirCardapio();
  const [erro, setErro] = useState('');

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const status = STATUS_CARDAPIO[cardapio.status];
  const sugerido = cardapio.status === 'SUGERIDO';

  async function transformarEmPedido() {
    const ok = await confirmar({
      titulo: 'Transformar em pedido',
      mensagem: `Será criado um pedido de ${formatarMoeda(cardapio.custoEstimado)} com a lista de compras do cardápio. Deseja continuar?`,
      textoConfirmar: 'Criar pedido',
    });
    if (!ok) {
      return;
    }
    setErro('');
    converter.mutate(cardapio.id, {
      onSuccess: (pedido) =>
        navigation.replace('PedidoDetalhe', { id: pedido.id, recemCriado: true }),
      onError: (falha) => setErro(mensagemDeErro(falha)),
    });
  }

  async function apagar() {
    const ok = await confirmar({
      titulo: 'Excluir cardápio',
      mensagem: 'O cardápio será apagado. Deseja continuar?',
      textoConfirmar: 'Excluir',
    });
    if (!ok) {
      return;
    }
    setErro('');
    excluir.mutate(cardapio.id, {
      onSuccess: () => navigation.goBack(),
      onError: (falha) => setErro(mensagemDeErro(falha)),
    });
  }

  return (
    <Tela>
      <View style={estilos.topo}>
        <Texto variante="titulo">Cardápio #{cardapio.id}</Texto>
        <Etiqueta texto={status.rotulo} tom={status.tom} icone={status.icone} />
      </View>
      <Texto variante="legenda" style={estilos.data}>
        Gerado em {formatarDataHora(cardapio.dataCriacao)}
      </Texto>

      <AvisoErro mensagem={erro} />

      <Card>
        <LinhaInfo icone="account-group-outline" rotulo="Alunos" valor={cardapio.numeroAlunos} />
        <LinhaInfo icone="calendar-week" rotulo="Dias letivos" valor={cardapio.diasLetivos} />
        <LinhaInfo
          icone="wallet-outline"
          rotulo="Orçamento"
          valor={formatarMoeda(cardapio.orcamento)}
        />
        <LinhaInfo
          icone="calculator-variant-outline"
          rotulo="Custo estimado"
          valor={formatarMoeda(cardapio.custoEstimado)}
        />
        <View style={estilos.orcamento}>
          <Etiqueta
            texto={cardapio.dentroDoOrcamento ? 'Dentro do orçamento' : 'Acima do orçamento'}
            tom={cardapio.dentroDoOrcamento ? 'sucesso' : 'perigo'}
            icone={cardapio.dentroDoOrcamento ? 'check' : 'alert-outline'}
          />
        </View>
      </Card>

      <Texto variante="subtitulo" style={estilos.secao}>
        Cardápio da semana
      </Texto>
      {cardapio.dias.map((dia) => (
        <Card key={dia.dia}>
          <Texto variante="legenda" cor={cores.primaria}>
            {dia.dia}
          </Texto>
          <Texto variante="destaque">{dia.prato}</Texto>
          {dia.ingredientes?.length ? (
            <Texto variante="legenda">{dia.ingredientes.join(', ')}</Texto>
          ) : null}
        </Card>
      ))}

      <Texto variante="subtitulo" style={estilos.secao}>
        Lista de compras
      </Texto>
      <Card>
        {cardapio.itens.map((item, indice) => (
          <View
            key={item.ofertaId}
            style={[
              estilos.item,
              indice < cardapio.itens.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: cores.divisor,
              },
            ]}
          >
            <View style={estilos.itemTopo}>
              <Texto variante="destaque" style={estilos.itemNome}>
                {item.produtoNome}
              </Texto>
              <Texto variante="destaque">{formatarMoeda(item.subtotal)}</Texto>
            </View>
            <Texto variante="legenda">
              {formatarQuantidade(item.quantidade, item.unidade)} · {item.produtorNome}
            </Texto>
            {item.justificativa ? (
              <Texto variante="legenda" cor={cores.textoTerciario} style={estilos.justificativa}>
                {item.justificativa}
              </Texto>
            ) : null}
          </View>
        ))}
      </Card>

      {cardapio.observacoes ? (
        <Card style={estilos.observacoes}>
          <Icone nome="note-text-outline" cor={cores.primaria} />
          <Texto variante="legenda" style={estilos.textoObservacoes}>
            {cardapio.observacoes}
          </Texto>
        </Card>
      ) : null}

      <Texto variante="legenda" style={estilos.aviso}>
        Sugestão gerada por inteligência artificial. Revise com o nutricionista da escola antes de
        usar.
      </Texto>

      {sugerido ? (
        <>
          <Botao
            titulo="Transformar em pedido"
            icone="cart-check"
            onPress={transformarEmPedido}
            carregando={converter.isPending}
          />
          <Botao
            titulo="Excluir cardápio"
            icone="delete-outline"
            variante="secundario"
            onPress={apagar}
            carregando={excluir.isPending}
            style={estilos.excluir}
          />
        </>
      ) : (
        <Botao
          titulo={`Ver pedido #${cardapio.pedidoId}`}
          icone="clipboard-list-outline"
          variante="secundario"
          onPress={() => navigation.navigate('PedidoDetalhe', { id: cardapio.pedidoId })}
        />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  data: { marginBottom: 12 },
  orcamento: { marginTop: 12 },
  secao: { marginTop: 8, marginBottom: 8 },
  item: { paddingVertical: 10 },
  itemTopo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemNome: { flex: 1 },
  justificativa: { marginTop: 2 },
  observacoes: { flexDirection: 'row', gap: 10 },
  textoObservacoes: { flex: 1 },
  aviso: { textAlign: 'center', marginVertical: 12 },
  excluir: { marginTop: 10 },
});
