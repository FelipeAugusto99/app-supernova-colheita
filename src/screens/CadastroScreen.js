import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AvisoErro, Botao, CampoTexto, Opcoes, Tela, Texto } from '../components';
import { useAuth } from '../context/AuthContext';
import { errosDeCampo, mensagemDeErro } from '../utils/erros';
import { montarCadastro, validarCadastro } from '../utils/formularioAuth';
import { TIPOS_COMPRADOR } from '../utils/perfis';
import { mascararData } from '../utils/validacoes';

const TIPOS_CONTA = [
  { valor: 'PRODUTOR', rotulo: 'Sou produtor' },
  { valor: 'COMPRADOR', rotulo: 'Sou comprador' },
];

const FORM_INICIAL = {
  nome: '',
  email: '',
  senha: '',
  confirmacao: '',
  municipio: '',
  uf: '',
  telefone: '',
  cpf: '',
  numeroCaf: '',
  validadeCaf: '',
  tipoComprador: 'ESCOLA',
  cnpj: '',
  verbaPnaeAnual: '',
};

export default function CadastroScreen() {
  const { cadastrar } = useAuth();

  const [tipoConta, setTipoConta] = useState('PRODUTOR');
  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const produtor = tipoConta === 'PRODUTOR';
  const alterar = (campo) => (valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  async function enviar() {
    const errosValidacao = validarCadastro(tipoConta, form);
    setErros(errosValidacao);
    setErroGeral('');
    if (Object.keys(errosValidacao).length > 0) {
      setErroGeral('Confira os campos destacados.');
      return;
    }

    setEnviando(true);
    try {
      await cadastrar(tipoConta, montarCadastro(tipoConta, form));
    } catch (erro) {
      setErros(errosDeCampo(erro));
      setErroGeral(mensagemDeErro(erro, 'Não foi possível criar a conta.'));
      setEnviando(false);
    }
  }

  return (
    <Tela>
      <Texto variante="subtitulo">Tipo de conta</Texto>
      <Opcoes opcoes={TIPOS_CONTA} valor={tipoConta} aoMudar={setTipoConta} style={estilos.grupo} />

      {!produtor ? (
        <Opcoes
          opcoes={TIPOS_COMPRADOR.map(({ valor, rotulo }) => ({ valor, rotulo }))}
          valor={form.tipoComprador}
          aoMudar={alterar('tipoComprador')}
          style={estilos.grupo}
        />
      ) : null}

      <AvisoErro mensagem={erroGeral} />

      <CampoTexto
        rotulo={produtor ? 'Nome completo ou da cooperativa' : 'Nome da instituição'}
        value={form.nome}
        onChangeText={alterar('nome')}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="E-mail"
        value={form.email}
        onChangeText={alterar('email')}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CampoTexto
        rotulo="Senha"
        value={form.senha}
        onChangeText={alterar('senha')}
        erro={erros.senha}
        senha
      />
      <CampoTexto
        rotulo="Confirmar senha"
        value={form.confirmacao}
        onChangeText={alterar('confirmacao')}
        erro={erros.confirmacao}
        senha
      />

      {produtor ? (
        <>
          <CampoTexto
            rotulo="CPF (só números)"
            value={form.cpf}
            onChangeText={alterar('cpf')}
            erro={erros.cpf}
            keyboardType="number-pad"
            maxLength={11}
          />
          <View style={estilos.linha}>
            <CampoTexto
              rotulo="Número do CAF"
              placeholder="Opcional"
              value={form.numeroCaf}
              onChangeText={alterar('numeroCaf')}
              erro={erros.numeroCaf}
              style={estilos.metade}
            />
            <CampoTexto
              rotulo="Validade do CAF"
              placeholder="DD/MM/AAAA"
              value={form.validadeCaf}
              onChangeText={(valor) => alterar('validadeCaf')(mascararData(valor))}
              erro={erros.validadeCaf}
              keyboardType="number-pad"
              style={estilos.metade}
            />
          </View>
          <Texto variante="legenda" style={estilos.dica}>
            Com o CAF válido você pode vender para escolas pelo PNAE.
          </Texto>
          <CampoTexto
            rotulo="Telefone"
            placeholder="Opcional"
            value={form.telefone}
            onChangeText={alterar('telefone')}
            keyboardType="phone-pad"
            maxLength={11}
          />
        </>
      ) : (
        <>
          <CampoTexto
            rotulo="CNPJ (só números)"
            value={form.cnpj}
            onChangeText={alterar('cnpj')}
            erro={erros.cnpj}
            keyboardType="number-pad"
            maxLength={14}
          />
          {form.tipoComprador === 'ESCOLA' ? (
            <CampoTexto
              rotulo="Verba anual do PNAE (R$)"
              placeholder="Ex.: 120000"
              value={form.verbaPnaeAnual}
              onChangeText={alterar('verbaPnaeAnual')}
              erro={erros.verbaPnaeAnual}
              keyboardType="decimal-pad"
            />
          ) : null}
        </>
      )}

      <View style={estilos.linha}>
        <CampoTexto
          rotulo="Município"
          value={form.municipio}
          onChangeText={alterar('municipio')}
          erro={erros.municipio}
          style={estilos.municipio}
        />
        <CampoTexto
          rotulo="UF"
          placeholder="SP"
          value={form.uf}
          onChangeText={(valor) => alterar('uf')(valor.toUpperCase())}
          erro={erros.uf}
          autoCapitalize="characters"
          maxLength={2}
          style={estilos.uf}
        />
      </View>

      <Botao
        titulo="Criar conta"
        icone="account-plus-outline"
        onPress={enviar}
        carregando={enviando}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginTop: 8, marginBottom: 16 },
  linha: { flexDirection: 'row', gap: 12 },
  metade: { flex: 1 },
  municipio: { flex: 3 },
  uf: { flex: 1 },
  dica: { marginTop: -6, marginBottom: 14 },
});
