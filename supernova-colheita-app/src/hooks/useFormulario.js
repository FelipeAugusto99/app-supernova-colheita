import { useCallback, useState } from 'react';

// Guarda os valores e os erros de um formulario; ao alterar um campo, o erro dele some
export function useFormulario(valoresIniciais) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});

  const alterar = useCallback(
    (campo) => (valor) => {
      setValores((atuais) => ({ ...atuais, [campo]: valor }));
      setErros((atuais) => (atuais[campo] ? { ...atuais, [campo]: undefined } : atuais));
    },
    []
  );

  return { valores, erros, setErros, alterar };
}
