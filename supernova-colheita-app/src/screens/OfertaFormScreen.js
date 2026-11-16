import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AvisoErro, Botao, CampoTexto, Carregando, Opcoes, Tela, Texto } from '../components';
import { useTema } from '../context/TemaContext';
import { useFormulario } from '../hooks/useFormulario';
import { useSalvarOferta } from '../hooks/useOfertas';
import { useProdutos } from '../hooks/useProdutos';
import { errosDeCampo, mensagemDeErro } from '../utils/erros';
import { nomesUnidades } from '../utils/formatadores';
import { formularioInicial, montarOferta, validarOferta } from '../utils/formularioOferta';
import { mascararData } from '../utils/validacoes';

export default function OfertaFormScreen({ route, navigation }) {
  const ofertaEditada = route.params?.oferta;
  const { cores } = useTema();
  const { data: produtos, isLoading } = useProdutos();
  const salvar = useSalvarOferta();

  const {
    valores: form,
    erros,
    setErros,
    alterar,
  } = useFormulario(formularioInicial(ofertaEditada));
  const [erroGeral, setErroGeral] = useState('');

  if (isLoading) {
    return <Carregando mensagem="Carregando produtos..." />;
  }

  const produtoEscolhido = produtos?.find((p) => p.id === form.produtoId);
  const unidade = produtoEscolhido ? nomesUnidades[produtoEscolhido.unidade] : 'unidade';

  function enviar() {
    const errosValidacao = validarOferta(form);
    setErros(errosValidacao);
    setErroGeral('');
    if (Object.keys(errosValidacao).length > 0) {
      return;
    }

    salvar.mutate(
      { id: ofertaEditada?.id, oferta: montarOferta(form) },
      {
        onSuccess: () => navigation.goBack(),
        onError: (erro) => {
          setErros(errosDeCampo(erro));
          setErroGeral(mensagemDeErro(erro, 'Não foi possível salvar a oferta.'));
        },
      }
    );
  }

  return (
    <Tela>
      <AvisoErro mensagem={erroGeral} />

      <Texto variante="destaque">Produto</Texto>
      <Opcoes
        opcoes={(produtos ?? []).map((p) => ({ valor: p.id, rotulo: p.nome }))}
        valor={form.produtoId}
        aoMudar={alterar('produtoId')}
        style={estilos.produtos}
      />
      {erros.produtoId ? (
        <Texto variante="legenda" cor={cores.perigo} style={estilos.erroProduto}>
          {erros.produtoId}
        </Texto>
      ) : null}

      <View style={estilos.linha}>
        <CampoTexto
          rotulo={`Preço por ${unidade} (R$)`}
          placeholder="0,00"
          value={form.precoUnitario}
          onChangeText={alterar('precoUnitario')}
          erro={erros.precoUnitario}
          keyboardType="decimal-pad"
          style={estilos.metade}
        />
        <CampoTexto
          rotulo={`Quantidade (${unidade})`}
          placeholder="0"
          value={form.qtdDisponivel}
          onChangeText={alterar('qtdDisponivel')}
          erro={erros.qtdDisponivel}
          keyboardType="decimal-pad"
          style={estilos.metade}
        />
      </View>

      <View style={estilos.linha}>
        <CampoTexto
          rotulo="Data da colheita"
          placeholder="DD/MM/AAAA"
          value={form.dataColheita}
          onChangeText={(valor) => alterar('dataColheita')(mascararData(valor))}
          erro={erros.dataColheita}
          keyboardType="number-pad"
          style={estilos.metade}
        />
        <CampoTexto
          rotulo="Validade"
          placeholder="DD/MM/AAAA"
          value={form.dataValidade}
          onChangeText={(valor) => alterar('dataValidade')(mascararData(valor))}
          erro={erros.dataValidade}
          keyboardType="number-pad"
          style={estilos.metade}
        />
      </View>

      <Botao
        titulo={ofertaEditada ? 'Salvar alterações' : 'Publicar oferta'}
        icone="content-save-outline"
        onPress={enviar}
        carregando={salvar.isPending}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  produtos: { marginTop: 8, marginBottom: 8 },
  erroProduto: { marginBottom: 8 },
  linha: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metade: { flex: 1 },
});
