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
  SeletorQuantidade,
  Tela,
  Texto,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { useTema } from '../context/TemaContext';
import { useCancelarOferta, useOferta } from '../hooks/useOfertas';
import { confirmar } from '../utils/confirmar';
import { mensagemDeErro } from '../utils/erros';
import {
  formatarData,
  formatarMoeda,
  formatarQuantidade,
  nomesUnidades,
  precoPorUnidade,
} from '../utils/formatadores';
import { STATUS_OFERTA } from '../utils/statusOferta';

export default function OfertaDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { usuario } = useAuth();
  const { data: oferta, isLoading, isError, error, refetch } = useOferta(id);
  const cancelamento = useCancelarOferta();
  const [erroAcao, setErroAcao] = useState('');
  const { adicionar, itens } = useCarrinho();
  const { cores } = useTema();
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const status = STATUS_OFERTA[oferta.status];
  const dono = usuario.produtorId === oferta.produtorId || usuario.role === 'GESTOR';
  const podeAlterar = dono && oferta.status !== 'CANCELADA';
  const podeComprar = usuario.role === 'COMPRADOR' && oferta.status === 'DISPONIVEL';
  const noCarrinho = itens.find((item) => item.oferta.id === oferta.id);

  function adicionarAoPedido() {
    adicionar(oferta, quantidade);
    setAdicionado(true);
  }

  async function cancelar() {
    const ok = await confirmar({
      titulo: 'Cancelar oferta',
      mensagem: 'A oferta deixa de aparecer para os compradores. Deseja continuar?',
      textoConfirmar: 'Cancelar oferta',
    });
    if (!ok) {
      return;
    }
    setErroAcao('');
    cancelamento.mutate(oferta.id, {
      onError: (erro) => setErroAcao(mensagemDeErro(erro)),
    });
  }

  return (
    <Tela>
      <View style={estilos.cabecalho}>
        <Texto variante="titulo">{oferta.produtoNome}</Texto>
        <Etiqueta texto={status.rotulo} tom={status.tom} icone={status.icone} />
      </View>

      <AvisoErro mensagem={erroAcao} />

      <Card>
        <LinhaInfo
          icone="cash"
          rotulo="Preço"
          valor={precoPorUnidade(oferta.precoUnitario, oferta.unidade)}
        />
        <LinhaInfo
          icone="package-variant-closed"
          rotulo="Disponível"
          valor={formatarQuantidade(oferta.qtdDisponivel, oferta.unidade)}
        />
        <LinhaInfo icone="sprout" rotulo="Colheita" valor={formatarData(oferta.dataColheita)} />
        <LinhaInfo
          icone="calendar-clock"
          rotulo="Validade"
          valor={formatarData(oferta.dataValidade)}
        />
        <LinhaInfo icone="account-outline" rotulo="Produtor" valor={oferta.produtorNome} />
        <LinhaInfo
          icone="map-marker-outline"
          rotulo="Local"
          valor={`${oferta.municipio}/${oferta.uf}`}
        />
      </Card>

      {podeComprar ? (
        <Card>
          <Texto variante="destaque" style={estilos.tituloCompra}>
            Quantidade ({nomesUnidades[oferta.unidade]})
          </Texto>
          <View style={estilos.linhaCompra}>
            <SeletorQuantidade
              valor={quantidade}
              maximo={oferta.qtdDisponivel}
              aoMudar={(valor) => {
                setQuantidade(valor);
                setAdicionado(false);
              }}
            />
            <Texto variante="destaque" cor={cores.primaria}>
              {formatarMoeda(quantidade * oferta.precoUnitario)}
            </Texto>
          </View>
          <Botao
            titulo="Adicionar ao pedido"
            icone="cart-plus"
            onPress={adicionarAoPedido}
            desabilitado={quantidade <= 0}
          />
          {adicionado || noCarrinho ? (
            <Botao
              titulo={`Ver meu pedido (${formatarQuantidade(noCarrinho?.quantidade ?? quantidade, oferta.unidade)} desta oferta)`}
              icone="cart-outline"
              variante="secundario"
              onPress={() => navigation.navigate('Carrinho')}
              style={estilos.verPedido}
            />
          ) : null}
        </Card>
      ) : null}

      {podeAlterar ? (
        <View style={estilos.acoes}>
          <Botao
            titulo="Editar oferta"
            icone="pencil-outline"
            onPress={() => navigation.navigate('OfertaForm', { oferta })}
          />
          <Botao
            titulo="Cancelar oferta"
            icone="close-circle-outline"
            variante="perigo"
            onPress={cancelar}
            carregando={cancelamento.isPending}
          />
        </View>
      ) : null}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { gap: 8, marginBottom: 16 },
  acoes: { gap: 12, marginTop: 8 },
  tituloCompra: { marginBottom: 8 },
  linhaCompra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verPedido: { marginTop: 10 },
});
