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
import { useCancelarOferta, useOferta } from '../hooks/useOfertas';
import { confirmar } from '../utils/confirmar';
import { mensagemDeErro } from '../utils/erros';
import { formatarData, formatarQuantidade, precoPorUnidade } from '../utils/formatadores';
import { STATUS_OFERTA } from '../utils/statusOferta';

export default function OfertaDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { usuario } = useAuth();
  const { data: oferta, isLoading, isError, error, refetch } = useOferta(id);
  const cancelamento = useCancelarOferta();
  const [erroAcao, setErroAcao] = useState('');

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const status = STATUS_OFERTA[oferta.status];
  const dono = usuario.produtorId === oferta.produtorId || usuario.role === 'GESTOR';
  const podeAlterar = dono && oferta.status !== 'CANCELADA';

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
});
