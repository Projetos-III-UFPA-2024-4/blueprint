// src/components/screens/menu-screen/index.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style'; // Importando os estilos

const MenuScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}> {/* Aplicando o estilo ao container */}
      <Text style={styles.title}>Menu Principal</Text> {/* Texto dentro de <Text> */}
      
      <TouchableOpacity
        style={styles.button} // Estilizando o botão
        onPress={() => navigation.navigate('AudioRecorder')}
      >
        <Text style={styles.buttonText}>Audio Recorder</Text> {/* Texto dentro de <Text> */}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button} // Estilizando o botão
        onPress={() => navigation.navigate('Screen1')}
      >
        <Text style={styles.buttonText}>Relatório</Text> {/* Texto dentro de <Text> */}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button} // Estilizando o botão
        onPress={() => navigation.navigate('Screen2')}
      >
        <Text style={styles.buttonText}>Histórico</Text> {/* Texto dentro de <Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default MenuScreen;
