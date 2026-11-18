import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet } from 'react-native';

import {
  Botao,
  Card,
  Carregando,
  CartaoOportunidade,
  Icone,
  ListaVazia,
  MensagemErro,
  Opcoes,
  Texto,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { useOportunidades } from '../hooks/useOportunidades';
import { mensagemDeErro } from '../utils/erros';

const TODAS = 'TODAS';

export default function OportunidadesScreen({ navigation }) {
  const { usuario } = useAuth();
  const { cores } = useTema();
  const { data = [], isLoading, isError, error, refetch, isRefetching } = useOportunidades();
  const [uf, setUf] = useState(TODAS);
  const podePublicar = usuario.role === 'COMPRADOR' || usuario.role === 'GESTOR';

  const filtros = useMemo(() => {
    const estados = [...new Set(data.map((o) => o.estado))].sort();
    return [{ valor: TODAS, rotulo: 'Todas' }, ...estados.map((e) => ({ valor: e, rotulo: e }))];
  }, [data]);

  if (isLoading) {
    return <Carregando mensagem="Buscando chamadas públicas..." />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const lista = uf === TODAS ? data : data.filter((o) => o.estado === uf);

  const cabecalho = (
    <>
      <Card style={[estilos.apresentacao, { backgroundColor: cores.superficieDestaque }]}>
        <Icone nome="bullhorn-outline" tamanho={26} cor={cores.primaria} />
        <Texto variante="legenda" style={estilos.texto}>
          {podePublicar
            ? 'Divulgue as chamadas públicas da sua escola ou prefeitura para os produtores da agricultura familiar.'
            : 'Escolas e prefeituras abrem chamadas públicas para comprar da agricultura familiar. Veja as abertas e prepare o seu projeto de venda.'}
        </Texto>
      </Card>
      {podePublicar ? (
        <Botao
          titulo="Publicar chamada pública"
          icone="plus"
          onPress={() => navigation.navigate('OportunidadeForm')}
          style={estilos.botao}
        />
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.filtros}>
        <Opcoes opcoes={filtros} valor={uf} aoMudar={setUf} style={estilos.semQuebra} />
      </ScrollView>
    </>
  );

  return (
    <FlatList
      data={lista}
      keyExtractor={(o) => String(o.id)}
      renderItem={({ item }) => (
        <CartaoOportunidade
          oportunidade={item}
          onPress={() => navigation.navigate('OportunidadeDetalhe', { id: item.id })}
        />
      )}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={<ListaVazia mensagem="Nenhuma chamada pública por aqui." />}
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

const estilos = StyleSheet.create({
  lista: { flexGrow: 1, padding: 16 },
  apresentacao: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  texto: { flex: 1 },
  botao: { marginBottom: 12 },
  filtros: { marginBottom: 12, flexGrow: 0 },
  semQuebra: { flexWrap: 'nowrap' },
});
