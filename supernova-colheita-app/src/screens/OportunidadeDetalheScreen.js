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
  situacaoDoPrazo,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { useExcluirOportunidade, useOportunidade } from '../hooks/useOportunidades';
import { confirmar } from '../utils/confirmar';
import { mensagemDeErro } from '../utils/erros';
import { formatarData, formatarMoeda } from '../utils/formatadores';

const passosParaParticipar = [
  'Tenha o CAF (Cadastro da Agricultura Familiar) válido.',
  'Leia o edital da chamada pública na instituição.',
  'Monte o projeto de venda com os produtos, quantidades e preços.',
  'Entregue a documentação pedida no edital dentro do prazo.',
];

export default function OportunidadeDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { usuario } = useAuth();
  const { cores } = useTema();
  const { data: oportunidade, isLoading, isError, error, refetch } = useOportunidade(id);
  const excluir = useExcluirOportunidade();
  const [erro, setErro] = useState('');
  const podeExcluir = usuario.role === 'COMPRADOR' || usuario.role === 'GESTOR';

  if (isLoading) {
    return <Carregando />;
  }
  if (isError) {
    return <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />;
  }

  const situacao = situacaoDoPrazo(oportunidade);

  async function apagar() {
    const ok = await confirmar({
      titulo: 'Excluir chamada pública',
      mensagem: 'A chamada deixa de aparecer para os produtores. Deseja continuar?',
      textoConfirmar: 'Excluir',
    });
    if (!ok) {
      return;
    }
    setErro('');
    excluir.mutate(oportunidade.id, {
      onSuccess: () => navigation.goBack(),
      onError: (falha) => setErro(mensagemDeErro(falha)),
    });
  }

  return (
    <Tela>
      <Etiqueta texto={situacao.rotulo} tom={situacao.tom} icone={situacao.icone} />
      <Texto variante="titulo" style={estilos.titulo}>
        {oportunidade.titulo}
      </Texto>

      <AvisoErro mensagem={erro} />

      <Card>
        <LinhaInfo icone="domain" rotulo="Instituição" valor={oportunidade.instituicao} />
        <LinhaInfo
          icone="map-marker-outline"
          rotulo="Local"
          valor={`${oportunidade.municipio}/${oportunidade.estado}`}
        />
        <LinhaInfo
          icone="cash-multiple"
          rotulo="Valor estimado"
          valor={formatarMoeda(oportunidade.valorEstimado)}
        />
        <LinhaInfo
          icone="calendar-clock"
          rotulo="Inscrições até"
          valor={formatarData(oportunidade.prazoInscricao)}
        />
      </Card>

      {usuario.role === 'PRODUTOR' ? (
        <Card style={{ backgroundColor: cores.superficieDestaque }}>
          <Texto variante="subtitulo" style={estilos.subtitulo}>
            Como participar
          </Texto>
          {passosParaParticipar.map((passo, indice) => (
            <View key={passo} style={estilos.passo}>
              <Texto variante="destaque" cor={cores.primaria}>
                {indice + 1}.
              </Texto>
              <Texto variante="legenda" style={estilos.textoPasso}>
                {passo}
              </Texto>
            </View>
          ))}
        </Card>
      ) : null}

      {podeExcluir ? (
        <Botao
          titulo="Excluir chamada pública"
          icone="delete-outline"
          variante="secundario"
          onPress={apagar}
          carregando={excluir.isPending}
        />
      ) : null}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  titulo: { marginTop: 8, marginBottom: 12 },
  subtitulo: { marginBottom: 8 },
  passo: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  textoPasso: { flex: 1 },
});
