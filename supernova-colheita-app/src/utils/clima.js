// Cidades de referencia quando a localizacao do celular nao esta disponivel
export const CIDADES = [
  { nome: 'Registro/SP', latitude: -24.4875, longitude: -47.8436 },
  { nome: 'Mogi das Cruzes/SP', latitude: -23.5229, longitude: -46.1883 },
  { nome: 'Campinas/SP', latitude: -22.9056, longitude: -47.0608 },
  { nome: 'Ribeirão Preto/SP', latitude: -21.1775, longitude: -47.8103 },
  { nome: 'Londrina/PR', latitude: -23.3045, longitude: -51.1696 },
  { nome: 'Uberlândia/MG', latitude: -18.9186, longitude: -48.2772 },
];

// Recomendacoes simples para o produtor a partir das condicoes atuais
export function dicasDoClima({ temperatura, umidade, chuva, vento }) {
  const dicas = [];
  if (chuva > 0) {
    dicas.push('Está chovendo: evite colher folhosas agora, elas estragam mais rápido molhadas.');
  }
  if (temperatura >= 30) {
    dicas.push('Calor forte: colha nas primeiras horas da manhã e guarde os produtos na sombra.');
  }
  if (umidade < 40) {
    dicas.push('Ar seco: reforce a irrigação no fim da tarde.');
  }
  if (vento >= 30) {
    dicas.push('Vento forte: proteja as mudas e confira as coberturas das estufas.');
  }
  if (dicas.length === 0) {
    dicas.push('Boas condições para colher e transportar os alimentos.');
  }
  return dicas;
}
