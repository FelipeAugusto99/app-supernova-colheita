import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import {
  Botao,
  Card,
  CartaoMeta,
  Carregando,
  Icone,
  ListaVazia,
  MensagemErro,
  Opcoes,
  Tela,
  Texto,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { useMetas, useMinhaMeta } from '../hooks/usePnae';
import { mensagemDeErro } from '../utils/erros';
import { formatarMoeda, formatarPercentual } from '../utils/formatadores';

const anoAtual = new Date().getFullYear();
const anos = [anoAtual, anoAtual - 1].map((ano) => ({ valor: ano, rotulo: String(ano) }));

function Explicacao() {
  const { cores } = useTema();
  return (
    <Card style={[estilos.explicacao, { backgroundColor: cores.superficieDestaque }]}>
      <Icone nome="scale-balance" tamanho={22} cor={cores.primaria} />
      <Texto variante="legenda" style={estilos.textoExplicacao}>
        Pela Lei 11.947/2009, pelo menos 30% da verba do PNAE deve ser usada na compra de alimentos
        da agricultura familiar.
      </Texto>
    </Card>
  );
}

// Escola: acompanha a propria meta
function MinhaMeta({ ano, navigation }) {
  const { data: meta, isLoading, isError, error, refetch } = useMinhaMeta(ano);

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const falta = Number(meta.faltaParaMeta);
  return (
    <>
      <CartaoMeta meta={meta} detalhado />
      {falta > 0 ? (
        <Botao
          titulo="Comprar da agricultura familiar"
          icone="basket-outline"
          onPress={() => navigation.navigate('Ofertas')}
        />
      ) : null}
    </>
  );
}

// Gestor: painel de todas as escolas do municipio
function PainelEscolas({ ano, cabecalho }) {
  const { cores } = useTema();
  const { data: metas = [], isLoading, isError, error, refetch, isRefetching } = useMetas(ano);

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const atingiram = metas.filter((m) => m.situacao === 'META ATINGIDA').length;
  const verba = metas.reduce((soma, m) => soma + Number(m.verbaPnaeAnual), 0);
  const comprado = metas.reduce((soma, m) => soma + Number(m.valorComprado), 0);
  const percentualGeral = verba > 0 ? (comprado / verba) * 100 : 0;

  const resumo = (
    <>
      {cabecalho}
      {metas.length > 0 ? (
        <Card>
          <Texto variante="subtitulo">
            {atingiram} de {metas.length}{' '}
            {metas.length === 1 ? 'escola atingiu' : 'escolas atingiram'} a meta
          </Texto>
          <Texto variante="legenda">
            No município: {formatarMoeda(comprado)} de {formatarMoeda(verba)} (
            {formatarPercentual(percentualGeral)}) comprados da agricultura familiar.
          </Texto>
        </Card>
      ) : null}
    </>
  );

  return (
    <FlatList
      data={metas}
      keyExtractor={(m) => String(m.compradorId)}
      renderItem={({ item }) => <CartaoMeta meta={item} />}
      ListHeaderComponent={resumo}
      ListEmptyComponent={<ListaVazia mensagem="Nenhuma escola com verba do PNAE cadastrada." />}
      contentContainerStyle={estilos.lista}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
    />
  );
}

export default function MetaPnaeScreen({ navigation }) {
  const { usuario } = useAuth();
  const [ano, setAno] = useState(anoAtual);

  const filtros = (
    <View style={estilos.filtros}>
      <Explicacao />
      <Opcoes opcoes={anos} valor={ano} aoMudar={setAno} />
    </View>
  );

  if (usuario.role === 'GESTOR') {
    return <PainelEscolas ano={ano} cabecalho={filtros} />;
  }

  return (
    <Tela>
      {filtros}
      <MinhaMeta ano={ano} navigation={navigation} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { flexGrow: 1, padding: 16 },
  filtros: { marginBottom: 4 },
  explicacao: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textoExplicacao: { flex: 1 },
});
