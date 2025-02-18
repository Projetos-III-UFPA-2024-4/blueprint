import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = () => {
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ];

          const granted: Record<string, string> = await PermissionsAndroid.requestMultiple(permissions);

          if (
            granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] !== PermissionsAndroid.RESULTS.GRANTED ||
            granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED ||
            granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            Alert.alert('Permissões negadas', 'Você precisa conceder acesso ao microfone e armazenamento.');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestPermissions();
    listAudioFiles();
  }, [selectedDirectory]);

  const listAudioFiles = async () => {
    if (!selectedDirectory) return;
    try {
      const files = await RNFS.readDir(selectedDirectory);
      const audioFiles = files
        .filter(file => file.name.endsWith('.mp3'))
        .map(file => file.path);
      setAudioFiles(audioFiles);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
    }
  };

  const generateAudioFileName = (): string => {
    const timestamp = new Date().getTime();
    return `${selectedDirectory}/gravação_${timestamp}.mp3`;
  };

  const startRecording = async () => {
    if (!selectedDirectory) {
      Alert.alert('Erro', 'Por favor, selecione um diretório antes de gravar.');
      return;
    }

    const filePath = generateAudioFileName();

    try {
      console.log('Iniciando gravação em:', filePath);
      await audioRecorderPlayer.startRecorder(filePath);
      setRecording(true);
      setAudioPath(filePath);
      console.log('Gravando...');
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      listAudioFiles();
      console.log('Gravação salva em:', audioPath);
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
    }
  };

  const playAudio = async (filePath: string) => {
    try {
      console.log('Reproduzindo:', filePath);
      setPlaying(true);
      await audioRecorderPlayer.startPlayer(filePath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          setPlaying(false);
        }
      });
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      Alert.alert('Erro', 'Não foi possível reproduzir o áudio.');
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>🎤 Gravador de Áudio</Text>

      <Button
        title="📂 Escolher Pasta"
        onPress={async () => {
          const res = await DocumentPicker.pickDirectory();
          if (res && res.uri) {
            let path = res.uri;
            if (path.startsWith('content://com.android.externalstorage.documents/tree/primary%3A')) {
              path = path.replace('content://com.android.externalstorage.documents/tree/primary%3A', '/storage/emulated/0/');
            }
            setSelectedDirectory(path);
            Alert.alert('Pasta Selecionada', `Os arquivos serão salvos em:\n${path}`);
            listAudioFiles();
          }
        }}
        color="blue"
      />

      <Text style={{ marginVertical: 10 }}>
        {selectedDirectory ? `📁 Pasta Selecionada: ${selectedDirectory}` : 'Nenhuma pasta selecionada'}
      </Text>

      <Button
        title={recording ? '🛑 Parar Gravação' : '🎙️ Iniciar Gravação'}
        onPress={recording ? stopRecording : startRecording}
        color={recording ? 'red' : 'green'}
        disabled={!selectedDirectory}
      />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>🎵 Áudios Gravados:</Text>

      {audioFiles.length === 0 ? (
        <Text>Nenhum áudio gravado.</Text>
      ) : (
        <FlatList
          data={audioFiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => playAudio(item)} style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 }}>
              <Text>{item.split('/').pop()}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
};

export { AudioRecorder };
