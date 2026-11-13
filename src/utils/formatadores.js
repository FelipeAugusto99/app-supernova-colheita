const formatadorMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatadorNumero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export const formatarMoeda = (valor) => formatadorMoeda.format(Number(valor ?? 0));

export const formatarNumero = (valor) => formatadorNumero.format(Number(valor ?? 0));

// "2026-11-20" -> "20/11/2026"
export function formatarData(iso) {
  if (!iso) {
    return '-';
  }
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function hojeBr() {
  const hoje = new Date();
  const dois = (n) => String(n).padStart(2, '0');
  return `${dois(hoje.getDate())}/${dois(hoje.getMonth() + 1)}/${hoje.getFullYear()}`;
}

export const nomesUnidades = {
  KG: 'kg',
  UN: 'un.',
  MACO: 'maço(s)',
  DUZIA: 'dúzia(s)',
  LITRO: 'litro(s)',
};

export const formatarQuantidade = (valor, unidade) =>
  `${formatarNumero(valor)} ${nomesUnidades[unidade] ?? unidade}`;

export const precoPorUnidade = (preco, unidade) =>
  `${formatarMoeda(preco)} / ${nomesUnidades[unidade] ?? unidade}`;

// dias ate a validade (0 = vence hoje)
export function diasAteVencer(iso) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const validade = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return Math.round((validade - hoje) / (24 * 60 * 60 * 1000));
}
