import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { Carregando } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import CadastroScreen from '../screens/CadastroScreen';
import CardapioDetalheScreen from '../screens/CardapioDetalheScreen';
import CardapioFormScreen from '../screens/CardapioFormScreen';
import CardapiosScreen from '../screens/CardapiosScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MetaPnaeScreen from '../screens/MetaPnaeScreen';
import MinhasOfertasScreen from '../screens/MinhasOfertasScreen';
import NotificacoesScreen from '../screens/NotificacoesScreen';
import OfertaDetalheScreen from '../screens/OfertaDetalheScreen';
import OfertaFormScreen from '../screens/OfertaFormScreen';
import OfertasScreen from '../screens/OfertasScreen';
import PedidoDetalheScreen from '../screens/PedidoDetalheScreen';
import PedidosScreen from '../screens/PedidosScreen';
import SobreScreen from '../screens/SobreScreen';
import { criarTemaNavegacao, opcoesCabecalho } from './temaNavegacao';

const Stack = createNativeStackNavigator();

// Telas que nao exigem login
function RotasPublicas() {
  const { cores } = useTema();
  return (
    <Stack.Navigator screenOptions={opcoesCabecalho(cores)}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
      <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre o App' }} />
    </Stack.Navigator>
  );
}

// Telas protegidas: so existem na navegacao quando ha usuario logado
const titulosPedidos = {
  COMPRADOR: 'Meus pedidos',
  PRODUTOR: 'Pedidos recebidos',
  GESTOR: 'Pedidos',
};

function RotasAutenticadas() {
  const { cores } = useTema();
  const { usuario } = useAuth();
  return (
    <Stack.Navigator screenOptions={opcoesCabecalho(cores)}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Supernova Colheita' }} />
      <Stack.Screen
        name="Ofertas"
        component={OfertasScreen}
        options={{ title: 'Ofertas da região' }}
      />
      <Stack.Screen
        name="MinhasOfertas"
        component={MinhasOfertasScreen}
        options={{ title: 'Minhas ofertas' }}
      />
      <Stack.Screen
        name="OfertaDetalhe"
        component={OfertaDetalheScreen}
        options={{ title: 'Detalhes da oferta' }}
      />
      <Stack.Screen
        name="OfertaForm"
        component={OfertaFormScreen}
        options={({ route }) => ({ title: route.params?.oferta ? 'Editar oferta' : 'Nova oferta' })}
      />
      <Stack.Screen name="Carrinho" component={CarrinhoScreen} options={{ title: 'Meu pedido' }} />
      <Stack.Screen
        name="Pedidos"
        component={PedidosScreen}
        options={{ title: titulosPedidos[usuario.role] }}
      />
      <Stack.Screen
        name="PedidoDetalhe"
        component={PedidoDetalheScreen}
        options={{ title: 'Detalhes do pedido' }}
      />
      <Stack.Screen
        name="Cardapios"
        component={CardapiosScreen}
        options={{ title: 'Cardápio inteligente' }}
      />
      <Stack.Screen
        name="CardapioForm"
        component={CardapioFormScreen}
        options={{ title: 'Novo cardápio' }}
      />
      <Stack.Screen
        name="CardapioDetalhe"
        component={CardapioDetalheScreen}
        options={{ title: 'Cardápio' }}
      />
      <Stack.Screen
        name="Notificacoes"
        component={NotificacoesScreen}
        options={{ title: 'Notificações' }}
      />
      <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre o App' }} />
      <Stack.Screen
        name="MetaPnae"
        component={MetaPnaeScreen}
        options={{ title: usuario.role === 'GESTOR' ? 'Meta PNAE das escolas' : 'Meta PNAE' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario, carregandoSessao } = useAuth();
  const { cores, escuro } = useTema();

  return (
    <NavigationContainer theme={criarTemaNavegacao(cores, escuro)}>
      <StatusBar style="light" />
      {carregandoSessao ? (
        <Carregando mensagem="Abrindo o app..." />
      ) : usuario ? (
        <RotasAutenticadas />
      ) : (
        <RotasPublicas />
      )}
    </NavigationContainer>
  );
}
