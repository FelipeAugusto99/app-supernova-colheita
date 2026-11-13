import { StyleSheet } from 'react-native';

import { Botao, Card, Tela, Texto } from '../components';
import { useAuth } from '../context/AuthContext';
import { nomesPerfis } from '../utils/perfis';

// Pessoas sao chamadas pelo primeiro nome; instituicoes pelo nome completo
function saudacao(usuario) {
  return usuario.role === 'COMPRADOR' ? usuario.nome : usuario.nome.split(' ')[0];
}

export default function HomeScreen() {
  const { usuario, sair } = useAuth();

  return (
    <Tela>
      <Texto variante="titulo">Olá, {saudacao(usuario)}!</Texto>
      <Texto variante="legenda" style={estilos.subtitulo}>
        Você entrou como {nomesPerfis[usuario.role]}.
      </Texto>

      <Card>
        <Texto variante="destaque">Bem-vindo ao Supernova Colheita</Texto>
        <Texto variante="legenda">
          Aqui produtores da agricultura familiar e compradores da região se encontram.
        </Texto>
      </Card>

      <Botao titulo="Sair" icone="logout" variante="secundario" onPress={sair} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  subtitulo: { marginBottom: 20 },
});
