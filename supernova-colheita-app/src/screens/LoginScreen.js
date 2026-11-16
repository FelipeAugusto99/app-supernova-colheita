import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AvisoErro, Botao, CampoTexto, Tela, Texto } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { useFormulario } from '../hooks/useFormulario';
import { mensagemDeErro } from '../utils/erros';
import { validarLogin } from '../utils/formularioAuth';

export default function LoginScreen({ navigation }) {
  const { entrar } = useAuth();
  const { cores } = useTema();

  const { valores: form, erros, setErros, alterar } = useFormulario({ email: '', senha: '' });
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    const errosValidacao = validarLogin(form);
    setErros(errosValidacao);
    setErroGeral('');
    if (Object.keys(errosValidacao).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      await entrar(form.email, form.senha);
    } catch (erro) {
      setErroGeral(mensagemDeErro(erro, 'Não foi possível entrar.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela comCabecalho={false} style={estilos.conteudo}>
      <View style={estilos.topo}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={estilos.logo}
          accessibilityIgnoresInvertColors
        />
        <Texto variante="titulo">Supernova Colheita</Texto>
        <Texto variante="legenda" style={estilos.centro}>
          Da agricultura familiar para a merenda escolar
        </Texto>
      </View>

      <AvisoErro mensagem={erroGeral} />

      <CampoTexto
        rotulo="E-mail"
        placeholder="voce@email.com"
        value={form.email}
        onChangeText={alterar('email')}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <CampoTexto
        rotulo="Senha"
        placeholder="Sua senha"
        value={form.senha}
        onChangeText={alterar('senha')}
        erro={erros.senha}
        senha
        onSubmitEditing={enviar}
      />

      <Botao titulo="Entrar" icone="login" onPress={enviar} carregando={enviando} />

      <Pressable
        accessibilityRole="link"
        onPress={() => navigation.navigate('Cadastro')}
        style={estilos.link}
      >
        <Texto variante="legenda">
          Ainda não tem conta?{' '}
          <Texto variante="legenda" cor={cores.primaria} style={estilos.negrito}>
            Criar conta
          </Texto>
        </Texto>
      </Pressable>

      <Pressable
        accessibilityRole="link"
        onPress={() => navigation.navigate('Sobre')}
        style={estilos.linkSobre}
      >
        <Texto variante="legenda" cor={cores.textoTerciario}>
          Sobre o App
        </Texto>
      </Pressable>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: { justifyContent: 'center' },
  topo: { alignItems: 'center', marginBottom: 32, gap: 4 },
  logo: { width: 96, height: 96, marginBottom: 8 },
  centro: { textAlign: 'center' },
  link: { alignItems: 'center', marginTop: 20, padding: 8 },
  linkSobre: { alignItems: 'center', marginTop: 4, padding: 8 },
  negrito: { fontFamily: 'Poppins_600SemiBold' },
});
