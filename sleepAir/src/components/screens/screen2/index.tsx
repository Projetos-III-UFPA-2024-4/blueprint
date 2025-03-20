import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importando a biblioteca corretamente
import styles from './style';

const Screen2 = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.185:5179/listar_audios');
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Análise</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Nome</Text>
          <Text style={styles.headerCell}>Resultado</Text>
          <Text style={styles.headerCell}>% Ronco</Text>
        </View>
        {/* Adicionando ScrollView apenas na parte da tabela */}
        <ScrollView style={styles.tableBody}>
          {data.map((audio, index) => (
            <View
              key={audio.id}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}
            >
              <Text style={styles.cell}>{audio.id}</Text>
              <Text style={styles.cell}>{decodeURIComponent(audio.name)}</Text>
              <View style={styles.cell}>
                {audio.resultado === "Sono possivelmente saudável." ? (
                  <Icon name="checkmark-circle-outline" size={20} color="#00FF00" />
                ) : (
                  <Icon name="close-circle-outline" size={20} color="#FF0000" />
                )}
              </View>
              <Text style={styles.cell}>{audio.percent_ronco}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Screen2;
