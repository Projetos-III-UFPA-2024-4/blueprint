// src/components/screens/menu-screen/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style'; 
import { AudioRecorder } from '../../AudioRecordPlayer/index'; // Importando o AudioRecorder

const MenuScreen = ({ navigation }: any) => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.header_text}>Bem-vindo(a)</Text>
                </View>
                <View style={styles.message}>
                    <Text style={styles.message_text}>Tenha uma <Text style={styles.message_text_span}>boa</Text> noite de sono</Text>
                </View>
                <View style={styles.container_content}>
                    <TouchableOpacity
                        style={styles.button} 
                        onPress={() => navigation.navigate('Gravador')}
                    >
                        <Text style={styles.buttonText}>Gravação de sono</Text> 
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button} 
                        onPress={() => navigation.navigate('Relatório')}
                    >
                        <Text style={styles.buttonText}>Relatório da Análise</Text> 
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Histórico')}
                    >
                        <Text style={styles.buttonText}>Histórico</Text> 
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default MenuScreen;
