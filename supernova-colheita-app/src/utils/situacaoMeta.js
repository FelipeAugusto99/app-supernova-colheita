// Situacoes calculadas pela API a partir do percentual comprado da agricultura familiar
export const SITUACAO_META = {
  'META ATINGIDA': { rotulo: 'Meta atingida', tom: 'sucesso', icone: 'check-decagram' },
  'EM ANDAMENTO': { rotulo: 'Em andamento', tom: 'alerta', icone: 'progress-clock' },
  CRITICO: { rotulo: 'Crítico', tom: 'perigo', icone: 'alert-outline' },
};

export const situacaoDaMeta = (situacao) =>
  SITUACAO_META[situacao] ?? { rotulo: situacao, tom: 'neutro', icone: 'help-circle-outline' };
