import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AvisoErro, Botao, CampoTexto, Card, Opcoes, Tela, Texto } from '../components';
import { useTema } from '../context/TemaContext';
import { useGerarCardapio } from '../hooks/useCardapios';
import { useFormulario } from '../hooks/useFormulario';
import { errosDeCampo, mensagemDeErro } from '../utils/erros';
import {
  formularioInicial,
  montarPedidoDeCardapio,
  validarCardapio,
} from '../utils/formularioCardapio';

const opcoesDias = [1, 2, 3, 4, 5].map((dia) => ({
  valor: dia,
  rotulo: dia === 1 ? '1 dia' : `${dia} dias`,
}));

export default function CardapioFormScreen({ navigation }) {
  const { cores } = useTema();
  const gerar = useGerarCardapio();
  const { valores: form, erros, setErros, alterar } = useFormulario(formularioInicial);
  const [erroGeral, setErroGeral] = useState('');

  function enviar() {
    const errosValidacao = validarCardapio(form);
    setErros(errosValidacao);
    setErroGeral('');
    if (Object.keys(errosValidacao).length > 0) {
      return;
    }

    gerar.mutate(montarPedidoDeCardapio(form), {
      onSuccess: (cardapio) => navigation.replace('CardapioDetalhe', { id: cardapio.id }),
      onError: (erro) => {
        setErros(errosDeCampo(erro));
        setErroGeral(mensagemDeErro(erro, 'Não foi possível gerar o cardápio.'));
      },
    });
  }

  if (gerar.isPending) {
    return (
      <View style={[estilos.gerando, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Texto variante="subtitulo" style={estilos.textoCentro}>
          Montando o cardápio...
        </Texto>
        <Texto variante="legenda" style={estilos.textoCentro}>
          A IA está combinando as ofertas da região com o orçamento. Isso pode levar até um minuto.
        </Texto>
      </View>
    );
  }

  return (
    <Tela>
      <AvisoErro mensagem={erroGeral} />

      <View style={estilos.linha}>
        <CampoTexto
          rotulo="Número de alunos"
          placeholder="Ex.: 120"
          value={form.numeroAlunos}
          onChangeText={alterar('numeroAlunos')}
          erro={erros.numeroAlunos}
          keyboardType="number-pad"
          style={estilos.metade}
        />
        <CampoTexto
          rotulo="Orçamento (R$)"
          placeholder="Ex.: 3000,00"
          value={form.orcamento}
          onChangeText={alterar('orcamento')}
          erro={erros.orcamento}
          keyboardType="decimal-pad"
          style={estilos.metade}
        />
      </View>

      <Texto variante="destaque">Dias letivos</Texto>
      <Opcoes
        opcoes={opcoesDias}
        valor={form.diasLetivos}
        aoMudar={alterar('diasLetivos')}
        style={estilos.dias}
      />

      <CampoTexto
        rotulo="Restrições (opcional)"
        placeholder="Ex.: 3 alunos com intolerância à lactose, evitar fritura"
        value={form.restricoes}
        onChangeText={alterar('restricoes')}
        erro={erros.restricoes}
        multiline
        numberOfLines={4}
        maxLength={500}
      />

      <Card style={[estilos.aviso, { backgroundColor: cores.infoFundo, borderColor: cores.info }]}>
        <Texto variante="legenda" cor={cores.info}>
          O cardápio é uma sugestão da IA. Ele usa só as ofertas disponíveis de produtores com CAF
          válido e deve ser revisado pelo nutricionista da escola.
        </Texto>
      </Card>

      <Botao titulo="Gerar cardápio com IA" icone="creation" onPress={enviar} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 12 },
  metade: { flex: 1 },
  dias: { marginTop: 8, marginBottom: 16 },
  aviso: { borderWidth: 1 },
  gerando: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  textoCentro: { textAlign: 'center' },
});
