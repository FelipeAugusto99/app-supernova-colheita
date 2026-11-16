import { StyleSheet } from 'react-native';

import { Botao, Card, CartaoCardapio, Icone, ListaPaginada, Texto } from '../components';
import { useTema } from '../context/TemaContext';
import { useCardapios } from '../hooks/useCardapios';

export default function CardapiosScreen({ navigation }) {
  const { cores } = useTema();
  const consulta = useCardapios();

  const cabecalho = (
    <>
      <Card style={[estilos.apresentacao, { backgroundColor: cores.superficieDestaque }]}>
        <Icone nome="chef-hat" tamanho={28} cor={cores.primaria} />
        <Texto variante="legenda" style={estilos.texto}>
          Informe quantos alunos, o orçamento e as restrições. A IA monta o cardápio da semana só
          com o que os produtores da agricultura familiar da sua região têm disponível.
        </Texto>
      </Card>
      <Botao
        titulo="Gerar novo cardápio"
        icone="creation"
        onPress={() => navigation.navigate('CardapioForm')}
        style={estilos.botao}
      />
    </>
  );

  return (
    <ListaPaginada
      consulta={consulta}
      itens={consulta.cardapios}
      cabecalho={cabecalho}
      mensagemVazia="Nenhum cardápio gerado ainda."
      renderItem={({ item }) => (
        <CartaoCardapio
          cardapio={item}
          onPress={() => navigation.navigate('CardapioDetalhe', { id: item.id })}
        />
      )}
    />
  );
}

const estilos = StyleSheet.create({
  apresentacao: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  texto: { flex: 1 },
  botao: { marginBottom: 16 },
});
