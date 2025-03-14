// src/components/MfccExtractor/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { extractMFCCs } from './mfccExtraction'; // Função para extrair MFCC
import axios from 'axios'; // Para enviar a métrica para o servidor

interface MfccExtractorProps {
  audioPath: string;
}

const MfccExtractor = ({ audioPath }: MfccExtractorProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Função para extrair MFCCs e enviar para o servidor
  const handleExtractMFCC = async () => {
    try {
      setLoading(true);
      // Extrai os MFCCs do áudio
      const mfccs = await extractMFCCs(audioPath);

      // Envia as métricas para o servidor
      await sendFeaturesToServer(mfccs);
    } catch (error) {
      console.error('Erro ao extrair MFCCs:', error);
      Alert.alert('Erro', 'Não foi possível extrair as métricas do áudio.');
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar os MFCCs extraídos para o servidor
  const sendFeaturesToServer = async (mfccs: number[]) => {
    try {
      const response = await axios.post('http://localhost:5000/avaliar_sono', {
        mfccs: mfccs,
      });
      Alert.alert('Sucesso', response.data.message);
    } catch (error) {
      console.error('Erro ao enviar dados ao servidor:', error);
      Alert.alert('Erro', 'Não foi possível enviar os dados ao servidor.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Extração e Avaliação de Sono</Text>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: 'blue', marginTop: 20 }}
        onPress={handleExtractMFCC}
        disabled={loading}
      >
        <Text style={{ color: 'white' }}>{loading ? 'Processando...' : 'Avaliar Sono'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MfccExtractor;
