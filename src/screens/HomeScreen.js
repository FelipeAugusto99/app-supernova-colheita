import { StyleSheet } from 'react-native';

import { Atalho, Botao, Tela, Texto } from '../components';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { nomesPerfis } from '../utils/perfis';

// Pessoas sao chamadas pelo primeiro nome; instituicoes pelo nome completo
function saudacao(usuario) {
  return usuario.role === 'COMPRADOR' ? usuario.nome : usuario.nome.split(' ')[0];
}

// Atalhos que cada perfil ve na tela inicial
function atalhosDoPerfil(role, quantidadeNoCarrinho) {
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
  ];
}

export default function HomeScreen({ navigation }) {
  const { usuario, sair } = useAuth();
  const { quantidadeItens } = useCarrinho();

  return (
    <Tela>
      <Texto variante="titulo">Olá, {saudacao(usuario)}!</Texto>
      <Texto variante="legenda" style={estilos.subtitulo}>
        Você entrou como {nomesPerfis[usuario.role]}.
      </Texto>

      {atalhosDoPerfil(usuario.role, quantidadeItens).map((atalho) => (
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
