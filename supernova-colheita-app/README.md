# Supernova Colheita - App Mobile

Global Solution 2026/2 (CitizenTech) - Mobile Application Development

| Nome                          | RM       | Turma  |
| ----------------------------- | -------- | ------ |
| Felipe Augusto Lopes Ferreira | RM563982 | 2TDSPG |
| Kaique Mascarenhas dos Santos | RM565802 | 2TDSPG |

- Vídeo: LINK_DO_VIDEO
- API Java (Azure): https://supernova-api-java-rm563982.azurewebsites.net/swagger-ui/index.html

## O problema

O PNAE (Programa Nacional de Alimentação Escolar) obriga os municípios a comprar pelo menos 30% da merenda escolar da agricultura familiar (Lei 11.947/2009), mas muitos não chegam à meta: o pequeno produtor não sabe vender para a escola, e a escola não sabe onde encontrar produtores na região.

## A solução

O Supernova Colheita conecta os dois lados. O produtor publica a colheita disponível; escolas, restaurantes e feiras fazem pedidos; a prefeitura (gestor) acompanha quanto da verba de cada escola já foi para a agricultura familiar. As regras do programa ficam na API: por exemplo, uma escola só compra de produtor com CAF (Cadastro da Agricultura Familiar) válido.

## Funcionalidades por perfil

| Perfil                                     | O que faz no app                                                                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Produtor**                               | Cadastra, edita e cancela ofertas; recebe pedidos e marca como confirmados e entregues; recebe notificações de pedidos novos                               |
| **Comprador** (escola, restaurante, feira) | Vê as ofertas da região, monta o pedido no carrinho, acompanha e cancela pedidos, gera o **cardápio inteligente com IA** e transforma o cardápio em pedido |
| **Escola** (comprador do tipo escola)      | Tudo do comprador e o painel da **meta PNAE** da escola                                                                                                    |
| **Gestor** (prefeitura)                    | Vê todas as ofertas e pedidos e o painel da meta PNAE de todas as escolas do município                                                                     |

## Telas

| Tela                             | Descrição                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| Login e Cadastro                 | Login com JWT e cadastro de produtor ou comprador, com validação dos campos                    |
| Início                           | Atalhos de acordo com o perfil e contador de notificações novas                                |
| Ofertas da região                | Lista paginada com filtro por produto e "puxar para atualizar"                                 |
| Minhas ofertas / Nova oferta     | CRUD de ofertas do produtor                                                                    |
| Detalhe da oferta                | Dados da oferta e botão para adicionar ao pedido                                               |
| Meu pedido                       | Carrinho com ajuste de quantidades e finalização                                               |
| Meus pedidos / Pedidos recebidos | Lista de pedidos e detalhe com confirmação, entrega e cancelamento                             |
| Notificações                     | Avisos de pedidos gerados pela fila do RabbitMQ da API; marcar como lida                       |
| Meta PNAE                        | Barra de progresso até a meta, verba, valor comprado e quanto falta                            |
| Cardápio inteligente             | A IA (Google Gemini, via Spring AI na API) monta o cardápio da semana com as ofertas da região |
| Sobre o App                      | Versão, **hash do commit de referência**, data do build, status da API e equipe                |

## Arquitetura do código

```
App.js                    providers (tema, sessão, carrinho, React Query) e navegação
app.config.js             injeta o hash do commit e a data do build na configuração do app
src/
  components/             componentes visuais reutilizáveis (Botao, CampoTexto, Card, Etiqueta...)
  context/                TemaContext (claro/escuro), AuthContext (sessão e JWT), CarrinhoContext
  hooks/                  hooks do React Query por recurso (useOfertas, usePedidos, useCardapios...)
  navigation/             rotas públicas (login) e protegidas (só com usuário logado)
  screens/                telas
  services/               acesso à API REST com Axios (uma função por endpoint)
  theme/                  cores, fontes e espaçamentos
  utils/                  validações, formatadores, regras de status e mensagens de erro
```

- **Camada de acesso à API:** `services/` concentra as chamadas HTTP; as telas usam os hooks de `hooks/`, que cuidam de cache, carregamento, paginação e atualização das listas depois de cada alteração.
- **Autenticação:** o token JWT da API Java fica salvo no AsyncStorage (nunca a senha). Ao abrir o app, a sessão é validada em `/auth/me`; se a API responder 401, o usuário volta para o login.
- **Feedback visual:** carregamento, mensagens de erro da API, estados vazios, confirmação antes de ações destrutivas e validação dos formulários.

## Tecnologias

- Expo SDK 58, React Native e JavaScript
- React Navigation (native stack)
- Axios
- TanStack Query (React Query)
- AsyncStorage
- Fontes Poppins e ícones Material Community
- ESLint e Prettier

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o `.env.example` para `.env`. Ele já aponta para a API publicada no Azure; para usar a API rodando no computador, troque pelo IP dele na rede.
3. Inicie:
   ```bash
   npx expo start
   ```
4. Abra no Expo Go (celular) ou no emulador Android.

Para conferir o código: `npm run lint`.

### Usuários de teste (senha `123456`)

| E-mail                                                                 | Perfil                                                    |
| ---------------------------------------------------------------------- | --------------------------------------------------------- |
| `gestor@supernova.com`                                                 | Gestor                                                    |
| `escola@supernova.com`                                                 | Comprador (escola)                                        |
| `restaurante@supernova.com`                                            | Comprador (restaurante)                                   |
| `jose@supernova.com`, `maria@supernova.com`, `terraviva@supernova.com` | Produtor (CAF válido)                                     |
| `benedita@supernova.com`                                               | Produtor com CAF vencido (escolas não podem comprar dele) |

## Publicação (Firebase App Distribution)

O APK é gerado pelo EAS Build com o perfil `preview` do `eas.json`, que já aponta para a API do Azure:

```bash
eas build -p android --profile preview
```

O APK é distribuído pelo Firebase App Distribution. A tela **Sobre o App** mostra o hash do commit usado no build: ele deve ser igual ao último commit deste repositório, o que garante que a versão publicada corresponde ao código-fonte.

## Uso de IA

Este projeto utilizou o Claude (Anthropic) como apoio no desenvolvimento: implementação de partes do app, explicação de erros e revisão de código. Todo o código foi revisado, testado e compreendido pelos integrantes do grupo.

A funcionalidade de cardápio inteligente usa o Google Gemini, chamado pela API Java (Spring AI).
