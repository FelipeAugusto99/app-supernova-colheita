import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Card,
  Carregando,
  Icone,
  LinhaInfo,
  MensagemErro,
  Opcoes,
  Tela,
  Texto,
} from '../components';
import { useTema } from '../context/TemaContext';
import { useClima } from '../hooks/useClima';
import { CIDADES, dicasDoClima } from '../utils/clima';
import { mensagemDeErro } from '../utils/erros';
import { formatarDataHora, formatarNumero } from '../utils/formatadores';

const MINHA_LOCALIZACAO = 'minha-localizacao';

export default function ClimaScreen() {
  const { cores } = useTema();
  const [posicao, setPosicao] = useState(null);
  const [buscandoPosicao, setBuscandoPosicao] = useState(true);
  const [escolha, setEscolha] = useState(CIDADES[0].nome);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const atual = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (ativo) {
            setPosicao({ latitude: atual.coords.latitude, longitude: atual.coords.longitude });
            setEscolha(MINHA_LOCALIZACAO);
          }
        }
      } catch {
        // sem localizacao: o produtor escolhe uma cidade
      } finally {
        if (ativo) {
          setBuscandoPosicao(false);
        }
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const opcoes = [
    ...(posicao ? [{ valor: MINHA_LOCALIZACAO, rotulo: 'Minha localização' }] : []),
    ...CIDADES.map((c) => ({ valor: c.nome, rotulo: c.nome })),
  ];
  const local = escolha === MINHA_LOCALIZACAO ? posicao : CIDADES.find((c) => c.nome === escolha);

  const {
    data: clima,
    isLoading,
    isError,
    error,
    refetch,
  } = useClima(buscandoPosicao ? null : local);

  return (
    <Tela>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.filtros}>
        <Opcoes opcoes={opcoes} valor={escolha} aoMudar={setEscolha} style={estilos.semQuebra} />
      </ScrollView>

      {buscandoPosicao || isLoading ? (
        <Carregando mensagem="Consultando o clima..." />
      ) : isError ? (
        <MensagemErro mensagem={mensagemDeErro(error)} onTentarNovamente={refetch} />
      ) : (
        <>
          <Card style={[estilos.principal, { backgroundColor: cores.primaria }]}>
            <Icone
              nome={clima.chuva > 0 ? 'weather-pouring' : 'weather-partly-cloudy'}
              tamanho={56}
              cor={cores.textoSobrePrimaria}
            />
            <Texto variante="titulo" cor={cores.textoSobrePrimaria} style={estilos.temperatura}>
              {formatarNumero(clima.temperatura)} °C
            </Texto>
            <Texto variante="legenda" cor={cores.textoSobrePrimaria}>
              {escolha === MINHA_LOCALIZACAO ? 'Na sua localização' : escolha} ·{' '}
              {formatarDataHora(clima.horario)}
            </Texto>
          </Card>

          <Card>
            <LinhaInfo
              icone="water-percent"
              rotulo="Umidade do ar"
              valor={`${formatarNumero(clima.umidade)}%`}
            />
            <LinhaInfo
              icone="weather-rainy"
              rotulo="Chuva agora"
              valor={`${formatarNumero(clima.chuva)} mm`}
            />
            <LinhaInfo
              icone="weather-windy"
              rotulo="Vento"
              valor={`${formatarNumero(clima.vento)} km/h`}
            />
          </Card>

          <Texto variante="subtitulo" style={estilos.secao}>
            Para a colheita
          </Texto>
          {dicasDoClima(clima).map((dica) => (
            <Card key={dica} style={estilos.dica}>
              <Icone nome="sprout-outline" cor={cores.primaria} />
              <Texto variante="legenda" style={estilos.textoDica}>
                {dica}
              </Texto>
            </Card>
          ))}

          <View style={estilos.fonte}>
            <Texto variante="legenda" cor={cores.textoTerciario}>
              Dados da Open-Meteo, consultados pela API .NET do Supernova Colheita.
            </Texto>
          </View>
        </>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  filtros: { marginBottom: 12, flexGrow: 0 },
  semQuebra: { flexWrap: 'nowrap' },
  principal: { alignItems: 'center', gap: 4, paddingVertical: 24 },
  temperatura: { fontSize: 40, lineHeight: 48 },
  secao: { marginTop: 8, marginBottom: 8 },
  dica: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textoDica: { flex: 1 },
  fonte: { alignItems: 'center', marginTop: 8 },
});
