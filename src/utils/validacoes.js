export const somenteDigitos = (valor = '') => valor.replace(/\D/g, '');

export const emailValido = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const ufValida = (uf = '') => /^[A-Z]{2}$/.test(uf);

// "31/12/2027" -> "2027-12-31" (ou null se a data for invalida)
export function dataBrParaIso(dataBr = '') {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataBr.trim());
  if (!partes) {
    return null;
  }
  const [, dia, mes, ano] = partes;
  const data = new Date(`${ano}-${mes}-${dia}T00:00:00`);
  if (Number.isNaN(data.getTime()) || data.getDate() !== Number(dia)) {
    return null;
  }
  return `${ano}-${mes}-${dia}`;
}

// Mascara simples para digitar datas: 31122027 -> 31/12/2027
export function mascararData(valor = '') {
  const digitos = somenteDigitos(valor).slice(0, 8);
  return digitos.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
}
