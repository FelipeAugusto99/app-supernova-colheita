import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AvisoErro, Botao, CampoTexto, Tela } from '../components';
import { useAuth } from '../context/AuthContext';
import { useFormulario } from '../hooks/useFormulario';
import { useCriarOportunidade } from '../hooks/useOportunidades';
import { errosDeCampo, mensagemDeErro } from '../utils/erros';
import {
  formularioInicial,
  montarOportunidade,
  validarOportunidade,
} from '../utils/formularioOportunidade';
import { mascararData } from '../utils/validacoes';

export default function OportunidadeFormScreen({ navigation }) {
  const { usuario } = useAuth();
  const criar = useCriarOportunidade();
  const { valores: form, erros, setErros, alterar } = useFormulario(formularioInicial(usuario));
  const [erroGeral, setErroGeral] = useState('');

  function enviar() {
    const errosValidacao = validarOportunidade(form);
    setErros(errosValidacao);
    setErroGeral('');
    if (Object.keys(errosValidacao).length > 0) {
      return;
    }
    criar.mutate(montarOportunidade(form), {
      onSuccess: () => navigation.goBack(),
      onError: (erro) => {
        setErros(errosDeCampo(erro));
        setErroGeral(mensagemDeErro(erro, 'Não foi possível publicar a chamada.'));
      },
    });
  }

  return (
    <Tela>
      <AvisoErro mensagem={erroGeral} />

      <CampoTexto
        rotulo="Título da chamada"
        placeholder="Ex.: Chamada pública de hortaliças para a merenda"
        value={form.titulo}
        onChangeText={alterar('titulo')}
        erro={erros.titulo}
        maxLength={150}
      />
      <CampoTexto
        rotulo="Instituição"
        placeholder="Escola ou prefeitura"
        value={form.instituicao}
        onChangeText={alterar('instituicao')}
        erro={erros.instituicao}
        maxLength={150}
      />
      <View style={estilos.linha}>
        <CampoTexto
          rotulo="Município"
          placeholder="Ex.: Registro"
          value={form.municipio}
          onChangeText={alterar('municipio')}
          erro={erros.municipio}
          maxLength={100}
          style={estilos.municipio}
        />
        <CampoTexto
          rotulo="UF"
          placeholder="SP"
          value={form.estado}
          onChangeText={(valor) => alterar('estado')(valor.toUpperCase())}
          erro={erros.estado}
          maxLength={2}
          autoCapitalize="characters"
          style={estilos.uf}
        />
      </View>
      <View style={estilos.linha}>
        <CampoTexto
          rotulo="Valor estimado (R$)"
          placeholder="Ex.: 25000,00"
          value={form.valorEstimado}
          onChangeText={alterar('valorEstimado')}
          erro={erros.valorEstimado}
          keyboardType="decimal-pad"
          style={estilos.metade}
        />
        <CampoTexto
          rotulo="Inscrições até"
          placeholder="DD/MM/AAAA"
          value={form.prazoInscricao}
          onChangeText={(valor) => alterar('prazoInscricao')(mascararData(valor))}
          erro={erros.prazoInscricao}
          keyboardType="number-pad"
          style={estilos.metade}
        />
      </View>

      <Botao
        titulo="Publicar chamada"
        icone="bullhorn-outline"
        onPress={enviar}
        carregando={criar.isPending}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 12 },
  municipio: { flex: 3 },
  uf: { flex: 1 },
  metade: { flex: 1 },
});
