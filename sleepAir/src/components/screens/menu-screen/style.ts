// src/components/screens/menu-screen/style.ts

import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    backgroundColor: Colors.white, // Cor de fundo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Espaçamento abaixo do título
  },
  button: {
    width: '80%',
    padding: 10,
    marginVertical: 10, // Espaçamento entre os botões
    backgroundColor: '#007bff', // Cor de fundo do botão
    borderRadius: 5, // Borda arredondada
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
