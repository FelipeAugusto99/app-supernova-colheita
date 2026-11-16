import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AvisoErro,
  Botao,
  Card,
  Carregando,
  Etiqueta,
  LinhaInfo,
  MensagemErro,
  Tela,
  Texto,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { useAtualizarStatusPedido, usePedido } from '../hooks/usePedidos';
import { confirmar } from '../utils/confirmar';
import { mensagemDeErro } from '../utils/erros';
import { formatarDataHora, formatarMoeda, formatarQuantidade } from '../utils/formatadores';
import { acoesDoPedido, STATUS_PEDIDO } from '../utils/statusPedido';

export default function PedidoDetalheScreen({ route }) {
  const { id, recemCriado } = route.params;
  const { usuario } = useAuth();
  const { cores } = useTema();
  const { data: pedido, isLoading, isError, error, refetch } = usePedido(id);
  const atualizarStatus = useAtualizarStatusPedido();
  const [erro, setErro] = useState('');

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const status = STATUS_PEDIDO[pedido.status];

  async function executar(acao) {
    if (acao.status === 'CANCELADO') {
      const ok = await confirmar({
        titulo: 'Cancelar pedido',
        mensagem: 'As quantidades voltam para o estoque das ofertas. Deseja cancelar?',
        textoConfirmar: 'Cancelar pedido',
      });
      if (!ok) {
        return;
      }
    }
    setErro('');
    atualizarStatus.mutate(
      { id: pedido.id, status: acao.status },
      { onError: (falha) => setErro(mensagemDeErro(falha)) }
    );
  }

  return (
    <Tela>
      {recemCriado && pedido.status === 'PENDENTE' ? (
        <View
          accessibilityRole="alert"
          style={[estilos.sucesso, { backgroundColor: cores.sucessoFundo }]}
        >
          <Texto cor={cores.sucesso}>
            Pedido #{pedido.id} enviado! Os produtores foram avisados para confirmar.
          </Texto>
        </View>
      ) : null}

      <View style={estilos.cabecalho}>
        <Texto variante="titulo">Pedido #{pedido.id}</Texto>
        <Etiqueta texto={status.rotulo} tom={status.tom} icone={status.icone} />
      </View>

      <AvisoErro mensagem={erro} />

      <Card>
        <LinhaInfo icone="store-outline" rotulo="Comprador" valor={pedido.compradorNome} />
        <LinhaInfo
          icone="calendar-outline"
          rotulo="Data"
          valor={formatarDataHora(pedido.dataPedido)}
        />
        <LinhaInfo icone="cash" rotulo="Total" valor={formatarMoeda(pedido.valorTotal)} />
      </Card>

      <Texto variante="subtitulo" style={estilos.secao}>
        Itens
      </Texto>
      {pedido.itens.map((item) => (
        <Card key={item.id}>
          <View style={estilos.item}>
            <View style={estilos.itemTextos}>
              <Texto variante="destaque">{item.produtoNome}</Texto>
              <Texto variante="legenda">{item.produtorNome}</Texto>
              <Texto variante="legenda">
                {formatarQuantidade(item.quantidade, item.unidade)} x{' '}
                {formatarMoeda(item.precoUnitario)}
              </Texto>
            </View>
            <Texto variante="destaque" cor={cores.primaria}>
              {formatarMoeda(item.subtotal)}
            </Texto>
          </View>
        </Card>
      ))}

      <View style={estilos.acoes}>
        {acoesDoPedido(pedido, usuario).map((acao) => (
          <Botao
            key={acao.status}
            titulo={acao.titulo}
            icone={acao.icone}
            variante={acao.variante}
            onPress={() => executar(acao)}
            carregando={
              atualizarStatus.isPending && atualizarStatus.variables?.status === acao.status
            }
            desabilitado={atualizarStatus.isPending}
          />
        ))}
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  sucesso: { borderRadius: 12, padding: 12, marginBottom: 16 },
  cabecalho: { gap: 8, marginBottom: 16 },
  secao: { marginTop: 8, marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemTextos: { flex: 1 },
  acoes: { gap: 12, marginTop: 8 },
});
