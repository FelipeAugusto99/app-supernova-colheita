import { StyleSheet } from 'react-native';

import { Atalho, Botao, Tela, Texto } from '../components';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { useComprador } from '../hooks/useComprador';
import { useNotificacoes } from '../hooks/useNotificacoes';
import { nomesPerfis } from '../utils/perfis';

// Pessoas sao chamadas pelo primeiro nome; instituicoes pelo nome completo
function saudacao(usuario) {
  return usuario.role === 'COMPRADOR' ? usuario.nome : usuario.nome.split(' ')[0];
}

// Atalhos que cada perfil ve na tela inicial
function atalhosDoPerfil(role, quantidadeNoCarrinho, ehEscola) {
  const ofertas = {
    tela: 'Ofertas',
    icone: 'basket-outline',
    titulo: 'Ofertas da região',
    descricao: 'Alimentos frescos da agricultura familiar',
  };

  if (role === 'PRODUTOR') {
    return [
      {
        tela: 'MinhasOfertas',
        icone: 'sprout-outline',
        titulo: 'Minhas ofertas',
        descricao: 'Publique e atualize o que você tem para vender',
      },
      {
        tela: 'Pedidos',
        icone: 'clipboard-list-outline',
        titulo: 'Pedidos recebidos',
        descricao: 'Confirme e registre as entregas',
      },
      {
        tela: 'Oportunidades',
        icone: 'bullhorn-outline',
        titulo: 'Chamadas públicas',
        descricao: 'Escolas e prefeituras que querem comprar de você',
      },
      {
        tela: 'Clima',
        icone: 'weather-partly-cloudy',
        titulo: 'Clima da lavoura',
        descricao: 'Temperatura, chuva e dicas para a colheita',
      },
      ofertas,
    ];
  }
  if (role === 'COMPRADOR') {
    return [
      ofertas,
      {
        tela: 'Carrinho',
        icone: 'cart-outline',
        titulo: 'Meu pedido',
        descricao:
          quantidadeNoCarrinho > 0
            ? `${quantidadeNoCarrinho} item(ns) aguardando finalização`
            : 'Nenhum item escolhido ainda',
      },
      {
        tela: 'Pedidos',
        icone: 'clipboard-list-outline',
        titulo: 'Meus pedidos',
        descricao: 'Acompanhe e cancele seus pedidos',
      },
      {
        tela: 'Cardapios',
        icone: 'chef-hat',
        titulo: 'Cardápio inteligente',
        descricao: 'A IA monta o cardápio com o que os produtores têm',
      },
      {
        tela: 'Oportunidades',
        icone: 'bullhorn-outline',
        titulo: 'Chamadas públicas',
        descricao: 'Divulgue o que a sua instituição quer comprar',
      },
      ...(ehEscola
        ? [
            {
              tela: 'MetaPnae',
              icone: 'chart-donut',
              titulo: 'Meta PNAE',
              descricao: 'Quanto da verba já foi para a agricultura familiar',
            },
          ]
        : []),
    ];
  }
  return [
    ofertas,
    {
      tela: 'Pedidos',
      icone: 'clipboard-list-outline',
      titulo: 'Pedidos',
      descricao: 'Todos os pedidos da plataforma',
    },
    {
      tela: 'MetaPnae',
      icone: 'chart-donut',
      titulo: 'Meta PNAE das escolas',
      descricao: 'Acompanhe os 30% da agricultura familiar no município',
    },
    {
      tela: 'Oportunidades',
      icone: 'bullhorn-outline',
      titulo: 'Chamadas públicas',
      descricao: 'Publique as chamadas da prefeitura',
    },
  ];
}

export default function HomeScreen({ navigation }) {
  const { usuario, sair } = useAuth();
  const { quantidadeItens } = useCarrinho();
  const { naoLidas } = useNotificacoes();
  const { data: comprador } = useComprador(usuario.compradorId);
  const ehEscola = comprador?.tipo === 'ESCOLA';

  const atalhos = [
    ...atalhosDoPerfil(usuario.role, quantidadeItens, ehEscola),
    {
      tela: 'Notificacoes',
      icone: naoLidas > 0 ? 'bell-badge-outline' : 'bell-outline',
      titulo: 'Notificações',
      descricao:
        naoLidas > 0
          ? `${naoLidas} ${naoLidas === 1 ? 'aviso novo' : 'avisos novos'} sobre pedidos`
          : 'Avisos sobre os seus pedidos',
    },
    {
      tela: 'Sobre',
      icone: 'information-outline',
      titulo: 'Sobre o App',
      descricao: 'Versão, commit de referência e equipe',
    },
  ];

  return (
    <Tela>
      <Texto variante="titulo">Olá, {saudacao(usuario)}!</Texto>
      <Texto variante="legenda" style={estilos.subtitulo}>
        Você entrou como {nomesPerfis[usuario.role]}.
      </Texto>

      {atalhos.map((atalho) => (
        <Atalho
          key={atalho.tela}
          icone={atalho.icone}
          titulo={atalho.titulo}
          descricao={atalho.descricao}
          onPress={() => navigation.navigate(atalho.tela)}
        />
      ))}

      <Botao
        titulo="Sair"
        icone="logout"
        variante="secundario"
        onPress={sair}
        style={estilos.sair}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  subtitulo: { marginBottom: 20 },
  sair: { marginTop: 12 },
});
