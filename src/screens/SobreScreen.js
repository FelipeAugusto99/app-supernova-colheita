import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Image, StyleSheet, View } from 'react-native';

import { Card, Etiqueta, LinhaInfo, Tela, Texto } from '../components';
import { useTema } from '../context/TemaContext';
import api, { apiNet } from '../services/api';
import { verificarApi, verificarApiNet } from '../services/sistemaService';
import { formatarData } from '../utils/formatadores';

const logo = require('../../assets/images/logo.png');

const integrantes = [
  { nome: 'Felipe Augusto Lopes Ferreira', rm: 'RM563982' },
  { nome: 'Kaique Mascarenhas dos Santos', rm: 'RM565802' },
];

function StatusApi({ chave, verificar }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['status-api', chave],
    queryFn: verificar,
    retry: false,
  });

  if (isLoading) {
    return <Etiqueta texto="Verificando..." tom="neutro" icone="progress-clock" />;
  }
  if (isError || !data?.online) {
    return <Etiqueta texto="Fora do ar" tom="perigo" icone="cloud-off-outline" />;
  }
  return <Etiqueta texto="No ar" tom="sucesso" icone="cloud-check-outline" />;
}

export default function SobreScreen() {
  const { cores } = useTema();
  const config = Constants.expoConfig ?? {};
  const extra = config.extra ?? {};

  return (
    <Tela>
      <View style={estilos.topo}>
        <Image source={logo} style={estilos.logo} accessibilityIgnoresInvertColors />
        <Texto variante="titulo">Supernova Colheita</Texto>
        <Texto variante="legenda" style={estilos.centro}>
          Conecta a agricultura familiar a escolas, restaurantes e feiras, ajudando os municípios a
          cumprir a meta do PNAE.
        </Texto>
      </View>

      <Card>
        <Texto variante="subtitulo" style={estilos.titulo}>
          Versão
        </Texto>
        <LinhaInfo icone="tag-outline" rotulo="Versão do app" valor={config.version ?? '-'} />
        <LinhaInfo
          icone="source-commit"
          rotulo="Commit de referência"
          valor={extra.commitHash ?? '-'}
        />
        <LinhaInfo
          icone="calendar-check-outline"
          rotulo="Data do build"
          valor={extra.dataBuild ? formatarData(extra.dataBuild) : '-'}
        />
      </Card>

      <Card>
        <Texto variante="subtitulo" style={estilos.titulo}>
          Serviços
        </Texto>
        <View style={estilos.servico}>
          <View style={estilos.servicoTexto}>
            <Texto variante="destaque">API Java</Texto>
            <Texto variante="legenda" numberOfLines={1}>
              {api.defaults.baseURL}
            </Texto>
          </View>
          <StatusApi chave="java" verificar={verificarApi} />
        </View>
        <View style={estilos.servico}>
          <View style={estilos.servicoTexto}>
            <Texto variante="destaque">API .NET</Texto>
            <Texto variante="legenda" numberOfLines={1}>
              {apiNet.defaults.baseURL}
            </Texto>
          </View>
          <StatusApi chave="net" verificar={verificarApiNet} />
        </View>
      </Card>

      <Card>
        <Texto variante="subtitulo" style={estilos.titulo}>
          Equipe
        </Texto>
        {integrantes.map((pessoa) => (
          <LinhaInfo
            key={pessoa.rm}
            icone="account-outline"
            rotulo={pessoa.nome}
            valor={pessoa.rm}
          />
        ))}
        <Texto variante="legenda" style={estilos.turma}>
          Turma 2TDSPG · FIAP · Global Solution 2026/2 (CitizenTech)
        </Texto>
      </Card>

      <Card style={{ backgroundColor: cores.superficieDestaque }}>
        <Texto variante="destaque">Objetivos de Desenvolvimento Sustentável</Texto>
        <Texto variante="legenda">
          ODS 2 (Fome zero e agricultura sustentável), ODS 10 (Redução das desigualdades) e ODS 11
          (Cidades e comunidades sustentáveis).
        </Texto>
      </Card>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { alignItems: 'center', gap: 6, marginBottom: 16 },
  logo: { width: 88, height: 88, marginBottom: 4 },
  centro: { textAlign: 'center' },
  titulo: { marginBottom: 4 },
  servico: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  servicoTexto: { flex: 1 },
  turma: { marginTop: 10 },
});
