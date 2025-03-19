// src/components/AudioRecorder/index.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    Modal,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { styles, modalStyles } from './style';
import axios from 'axios'; // Adiciona axios para envio ao servidor

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = ({ navigation }: any)  => {
    const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const [audioPath, setAudioPath] = useState<string>('');
    const [audioFiles, setAudioFiles] = useState<string[]>([]);
    const [playing, setPlaying] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
    const [renameModalVisible, setRenameModalVisible] = useState<boolean>(false);
    const [newFileName, setNewFileName] = useState<string>('');

    // Solicita permissões para gravação de áudio
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

    // Escolhe a pasta para salvar os áudios gravados
    const chooseDirectory = async () => {
        try {
            const res = await DocumentPicker.pickDirectory();
            if (res && res.uri) {
                let path = res.uri;
                if (path.startsWith('content://com.android.externalstorage.documents/tree/primary%3A')) {
                    path = path.replace(
                        'content://com.android.externalstorage.documents/tree/primary%3A',
                        '/storage/emulated/0/'
                    );
                }
                setSelectedDirectory(path);
                await AsyncStorage.setItem('selectedDirectory', path);
                listAudioFiles(path);
            }
        } catch (error) {
            console.error('Erro ao selecionar pasta:', error);
        }
    };

    // Carrega o diretório salvo no AsyncStorage
    const loadSelectedDirectory = async () => {
        try {
            const storedDir = await AsyncStorage.getItem('selectedDirectory');
            if (storedDir) {
                setSelectedDirectory(storedDir);
                listAudioFiles(storedDir);
            } else {
                await chooseDirectory();
            }
        } catch (error) {
            console.error('Erro ao carregar diretório salvo:', error);
        }
    };

    useEffect(() => {
        requestPermissions();
        loadSelectedDirectory();
    }, []);

    const listAudioFiles = async (directory?: string) => {
        const dir = directory || selectedDirectory;
        if (!dir) return;
        try {
            const files = await RNFS.readDir(dir);
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

    // Alterna entre reproduzir e pausar o áudio
    const togglePlayback = async () => {
        if (!selectedAudio) return;
        if (!playing) {
            try {
                console.log('Iniciando reprodução:', selectedAudio);
                setPlaying(true);
                await audioRecorderPlayer.startPlayer(selectedAudio);
                audioRecorderPlayer.addPlayBackListener((e) => {
                    if (e.currentPosition >= e.duration) {
                        audioRecorderPlayer.stopPlayer();
                        setPlaying(false);
                    }
                });
            } catch (error) {
                console.error('Erro ao reproduzir áudio:', error);
                Alert.alert('Erro', 'Não foi possível reproduzir o áudio.');
                setPlaying(false);
            }
        } else {
            try {
                console.log('Parando reprodução:', selectedAudio);
                await audioRecorderPlayer.stopPlayer();
                setPlaying(false);
            } catch (error) {
                console.error('Erro ao parar áudio:', error);
                Alert.alert('Erro', 'Não foi possível parar o áudio.');
            }
        }
    };

    const deleteAudio = async (filePath: string) => {
        try {
            await RNFS.unlink(filePath);
            listAudioFiles();
            setModalVisible(false);
        } catch (error) {
            console.error('Erro ao excluir áudio:', error);
            Alert.alert('Erro', 'Não foi possível excluir o áudio.');
        }
    };

    const shareAudio = async (filePath: string) => {
        try {
            const options = {
                title: 'Compartilhar Áudio',
                url: 'file://' + filePath,
                type: 'audio/mp3',
            };
            await Share.open(options);
        } catch (error) {
            console.error('Erro ao compartilhar áudio:', error);
            Alert.alert('Erro', 'Não foi possível compartilhar o áudio.');
        }
    };

    // Envia o arquivo de áudio para o servidor
    const sendAudioToServer = async (audioFilePath: string) => {
        const formData = new FormData();
        formData.append('audio', {
            uri: audioFilePath,
            type: 'audio/mp3',
            name: 'audio.mp3',
        });
        try {
            const response = await axios.post('http://89.116.74.250:8013/avaliar_sono', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Resposta do servidor:', response);
        } catch (error) {
        }
    };

    const handleEvaluateSleep = async () => {
        if (!selectedAudio) {
            Alert.alert('Erro', 'Nenhum áudio selecionado para avaliação.');
            return;
        }
        try {
            await sendAudioToServer(selectedAudio);
            // navigation.navigate('Relatório');
        } catch (error) {
            console.error('Erro ao avaliar o sono:', error);
            Alert.alert('Erro', 'Não foi possível avaliar o sono.');
        }
    };

    const renameAudio = async () => {
        if (!selectedAudio || !selectedDirectory) return;
        const trimmedName = newFileName.trim();
        if (!trimmedName) {
            Alert.alert('Erro', 'O novo nome não pode ser vazio.');
            return;
        }
        // Garante que a extensão .mp3 seja aplicada
        const newPath = `${selectedDirectory}/${trimmedName}.mp3`;
        try {
            await RNFS.moveFile(selectedAudio, newPath);
            Alert.alert('Sucesso', 'Áudio renomeado com sucesso.');
            setRenameModalVisible(false);
            setModalVisible(false);
            listAudioFiles();
        } catch (error) {
            console.error('Erro ao renomear áudio:', error);
            Alert.alert('Erro', 'Não foi possível renomear o áudio.');
        }
    };

    // Função para abrir o modal de opções de áudio
    const handleAudioPress = (item: string) => {
        setSelectedAudio(item);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SleepAir</Text>

            <TouchableOpacity
                style={recording ? styles.stopButton : styles.recordButton}
                onPress={recording ? stopRecording : startRecording}
                disabled={!selectedDirectory}
            >
                <Text style={styles.buttonText}>{recording ? 'Parar' : 'Gravar'}</Text>
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
                            <TouchableOpacity onPress={() => handleAudioPress(item)} style={styles.audioItem}>
                                <Text>{item.split('/').pop()}</Text>
                            </TouchableOpacity>
                        )}
                        nestedScrollEnabled={true}
                        style={{ maxHeight: '90%' }}
                    />
                )}
            </View>

            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        await chooseDirectory();
                    }}
                >
                    <Text style={styles.buttonText}>Escolher Pasta</Text>
                </TouchableOpacity>
                <Text style={[styles.directoryText, !selectedDirectory && { color: 'red' }]}>
                    {selectedDirectory ? `${selectedDirectory}` : 'Nenhuma pasta selecionada'}
                </Text>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { }}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <Text style={modalStyles.modalTitle}>Opções para o Áudio</Text>
                        <Text style={modalStyles.modalText}>
                            {selectedAudio ? selectedAudio.split('/').pop() : ''}
                        </Text>
                        <TouchableOpacity
                            style={[
                                modalStyles.modalButton,
                                playing && { backgroundColor: '#e77e28' }, // Altera a cor do botão enquanto reproduz
                            ]}
                            onPress={togglePlayback} // Chama a função togglePlayback
                        >
                            <Text style={modalStyles.modalButtonText}>
                                {playing ? 'Parar' : 'Reproduzir'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={modalStyles.modalButton}
                            onPress={handleEvaluateSleep} // Adiciona a funcionalidade de avaliar o sono
                        >
                            <Text style={modalStyles.modalButtonText}>Avaliar Sono</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={modalStyles.modalButton}
                            onPress={() => {
                                if (selectedAudio) {
                                    deleteAudio(selectedAudio);
                                }
                            }}
                        >
                            <Text style={modalStyles.modalButtonText}>Excluir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={modalStyles.modalButton}
                            onPress={() => {
                                if (selectedAudio) {
                                    shareAudio(selectedAudio);
                                }
                            }}
                        >
                            <Text style={modalStyles.modalButtonText}>Compartilhar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={modalStyles.modalButton}
                            onPress={() => {
                                if (selectedAudio) {
                                    const currentName = selectedAudio.split('/').pop()?.replace('.mp3', '');
                                    setNewFileName(currentName || '');
                                    setRenameModalVisible(true);
                                }
                            }}
                        >
                            <Text style={modalStyles.modalButtonText}>Renomear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[modalStyles.modalButton, modalStyles.closeButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={modalStyles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={renameModalVisible}
                onRequestClose={() => setRenameModalVisible(false)}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <Text style={modalStyles.modalTitle}>Renomear Áudio</Text>
                        <TextInput
                            style={modalStyles.input}
                            value={newFileName}
                            onChangeText={setNewFileName}
                            placeholder="Novo nome (sem extensão)"
                        />
                        <TouchableOpacity
                            style={modalStyles.modalButton}
                            onPress={renameAudio}
                        >
                            <Text style={modalStyles.modalButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[modalStyles.modalButton, modalStyles.closeButton]}
                            onPress={() => setRenameModalVisible(false)}
                        >
                            <Text style={modalStyles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export { AudioRecorder };
