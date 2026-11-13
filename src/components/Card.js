import { Pressable, StyleSheet, View } from 'react-native';

import { useTema } from '../context/TemaContext';
import { raios } from '../theme/espacos';

export default function Card({ children, onPress, style, ...props }) {
  const { cores } = useTema();
  const estiloBase = [
    estilos.card,
    { backgroundColor: cores.superficie, borderColor: cores.borda, shadowColor: cores.sombra },
    style,
  ];

  if (!onPress) {
    return (
      <View style={estiloBase} {...props}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [estiloBase, pressed && { opacity: 0.85 }]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    borderRadius: raios.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
