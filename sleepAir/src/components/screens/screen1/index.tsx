import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const Screen1 = () => {
  const [data, setData] = useState<any>(null); // Tipando 'data' como qualquer tipo
  const [loading, setLoading] = useState<boolean>(true); // Tipando 'loading' como booleano
  const [error, setError] = useState<string | null>(null); // Tipando 'error' como string ou null

  useEffect(() => {
    // Função para obter os dados da API
    const fetchData = async () => {
      try {
        const response = await fetch('http://89.116.74.250:8013/listar_audios');
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) { // Tipando o 'error' da captura como qualquer tipo
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Chama a função de fetch ao montar o componente
    fetchData();
  }, []); // O array vazio significa que o efeito será executado apenas uma vez, quando o componente for montado

  // Exibe um indicador de carregamento enquanto os dados são carregados
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  // Exibe mensagem de erro se houver erro
  if (error) {
    return (
      <View>
        <Text>Erro: {error}</Text>
      </View>
    );
  }

  // Exibe os dados quando carregados
  return (
    <View>
      <Text>Dados recebidos:</Text>
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </View>
  );
};

export default Screen1;
