import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';



const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [audioPath, setAudioPath] = useState('');
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    // Solicitar permissões apenas quando o componente for montado
    useEffect(() => {
        const requestPermissions = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    ]);

                    if (
                        granted['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED ||
                        granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
                        granted['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        Alert.alert('Permissões negadas', 'Você precisa conceder acesso ao microfone e armazenamento.');
                        setPermissionsGranted(false);
                    } else {
                        setPermissionsGranted(true);
                    }
                } catch (err) {
                    console.warn(err);
                }
            } else {
                setPermissionsGranted(true); // iOS não precisa dessa solicitação
            }
        };

        requestPermissions();
    }, []);

    // Iniciar gravação
    // Iniciar gravação
    const startRecording = async () => {
        if (!permissionsGranted) {
            Alert.alert('Permissões necessárias', 'O app não tem permissão para gravar áudio.');
            return;
        }

        setRecording(true);

        // Define o caminho do arquivo apenas para Android
        const path = `${RNFS.ExternalCachesDirectoryPath}/teste.mp3`;

        setAudioPath(path);
        await audioRecorderPlayer.startRecorder(path);
    };


    // Parar gravação
    const stopRecording = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        setRecording(false);
        setAudioPath(result);
        console.log('Gravação salva em:', result);
    };

    // Reproduzir áudio gravado
    const startPlayback = async () => {
        if (!audioPath) {
            Alert.alert('Nenhum áudio gravado', 'Grave um áudio antes de reproduzir.');
            return;
        }
        setPlaying(true);
        await audioRecorderPlayer.startPlayer(audioPath);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
                audioRecorderPlayer.stopPlayer();
                setPlaying(false);
            }
        });
    };

    // Parar reprodução
    const stopPlayback = async () => {
        await audioRecorderPlayer.stopPlayer();
        setPlaying(false);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Gravador de Áudio</Text>
            <Button title={recording ? 'Parar Gravação' : 'Iniciar Gravação'} onPress={recording ? stopRecording : startRecording} disabled={!permissionsGranted} />
            <Button title={playing ? 'Parar Reprodução' : 'Reproduzir Áudio'} onPress={playing ? stopPlayback : startPlayback} disabled={!audioPath} />
        </View>
    );
};

export { AudioRecorder };
