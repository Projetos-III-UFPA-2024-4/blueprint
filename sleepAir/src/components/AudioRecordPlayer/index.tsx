import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { styles } from './style';

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
                        console.log('Permissões negadas', 'Você precisa conceder acesso ao microfone e armazenamento.');
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
    
            // Filtra apenas arquivos MP3 e ordena pela data de modificação (mtime)
            const audioFiles = files
                .filter(file => file.name.endsWith('.mp3'))
                .sort((a, b) => {
                    const dateA = a.mtime ? new Date(a.mtime).getTime() : 0;
                    const dateB = b.mtime ? new Date(b.mtime).getTime() : 0;
                    return dateB - dateA;
                })
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
        <View style={styles.container}>
            <Text style={styles.title}>SleepAir</Text>

            <TouchableOpacity
                style={recording ? styles.stopButton : styles.recordButton}
                onPress={recording ? stopRecording : startRecording}
                disabled={!selectedDirectory}
            >
                <Text style={styles.buttonText}>
                    {recording ? 'Parar' : 'Gravar'}
                </Text>
            </TouchableOpacity>
            <View style={styles.audioContainer}>
                <Text style={styles.subTitle}>Áudios Gravados:</Text>
                {audioFiles.length === 0 ? (
                    <Text style={styles.noAudioText}>Nenhum áudio gravado.</Text>
                ) : (
                    <FlatList
                        data={audioFiles}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => playAudio(item)} style={styles.audioItem}>
                                <Text>{item.split('/').pop()}</Text>
                            </TouchableOpacity>
                        )}
                        nestedScrollEnabled={true}
                        style={{ maxHeight: '90%' }} // Define altura máxima para evitar ocupar toda a tela
                    />
                )}
            </View>
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        const res = await DocumentPicker.pickDirectory();
                        if (res && res.uri) {
                            let path = res.uri;
                            if (path.startsWith('content://com.android.externalstorage.documents/tree/primary%3A')) {
                                path = path.replace('content://com.android.externalstorage.documents/tree/primary%3A', '/storage/emulated/0/');
                            }
                            setSelectedDirectory(path);
                            listAudioFiles();
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Escolher Pasta</Text>
                </TouchableOpacity>
                <Text style={[styles.directoryText, !selectedDirectory && { color: 'red' }]}>
                    {selectedDirectory ? `${selectedDirectory}` : 'Nenhuma pasta selecionada'}
                </Text>

            </View>
        </View>
    );
};

export { AudioRecorder };
