import os
import numpy as np  # type: ignore
from tensorflow.keras.models import load_model  # type: ignore
from sklearn.model_selection import train_test_split  # type: ignore
from tensorflow.keras.utils import to_categorical  # type: ignore
import librosa
from models.dataset import download_dataset, load_dataset
from models.model import build_model

class Controller:
    def __init__(self):
        """
        Inicializa a classe Controller, que orquestra o fluxo da aplicação, incluindo o carregamento de dados,
        treinamento do modelo e avaliação de gravações noturnas.
        """
        self.model = self.carregar_modelo()  # Carrega o modelo salvo, se existir
        self.input_shape = None


    def carregar_modelo(self):
        """
        Carrega o modelo treinado a partir de um arquivo .h5. Se o modelo não existir, retorna None.
        """
        try:
            if os.path.exists('modelo_sono.h5'):
                print("Modelo carregado com sucesso.")
                return load_model('modelo_sono.h5')
            else:
                print("Modelo não encontrado. Necessário treinar o modelo primeiro.")
                return None
        except Exception as e:
            print(f"Erro ao carregar o modelo: {e}")
            return None


    def preparar_dados(self):
        """
        Baixa o dataset e carrega os dados, extraindo as features dos áudios e separando os dados em conjuntos
        de treino e teste.
        """
        path = download_dataset()
        print("Carregando dataset e extraindo features...")
        X, y = load_dataset(path)
        print("Dataset carregado. Formato de X:", X.shape, "e y:", y.shape)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        y_train_cat = to_categorical(y_train)
        y_test_cat = to_categorical(y_test)
        return X_train, X_test, y_train_cat, y_test_cat


    def treinar_modelo(self, X_train, X_test, y_train_cat, y_test_cat, epochs=30, batch_size=32):
        """
        Constrói, treina e avalia o modelo de rede neural.
        """
        self.input_shape = X_train.shape[1:]
        self.model = build_model(self.input_shape)
        self.model.summary()
        
        self.model.fit(X_train, y_train_cat, epochs=epochs, batch_size=batch_size,
                        validation_data=(X_test, y_test_cat))
        
        loss, accuracy = self.model.evaluate(X_test, y_test_cat)
        print("Acurácia no conjunto de teste: {:.2f}%".format(accuracy * 100))
        
        # Salva o modelo treinado
        self.model.save('modelo_sono.h5')
        print("Modelo salvo como 'modelo_sono.h5'.")


    def avaliar_noite(self, audio_path, segment_duration=1.0, threshold=20):

        """
        Processa uma gravação noturna completa e classifica cada segmento.
        Retorna um dicionário com os resultados da avaliação.
        """
        if self.model is None:
            return {"error": "Modelo não treinado. Treine o modelo antes de avaliar uma gravação."}
        
        # Carrega a gravação completa e obtém a taxa de amostragem
        audio, sample_rate = librosa.load(audio_path, sr=None)
        total_duration = librosa.get_duration(y=audio, sr=sample_rate)
        
        segments = []
        # Segmenta o áudio e processa cada segmento
        for start in np.arange(0, total_duration, segment_duration):
            end = min(start + segment_duration, total_duration)
            segment_audio = audio[int(start * sample_rate):int(end * sample_rate)]
            
            # Extrai os MFCCs para cada segmento
            mfccs = librosa.feature.mfcc(y=segment_audio, sr=sample_rate, n_mfcc=40)
            
            # Padroniza a quantidade de frames
            if mfccs.shape[1] < 44:
                pad_width = 44 - mfccs.shape[1]
                mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode='constant')
            else:
                mfccs = mfccs[:, :44]
            
            # Expande a dimensão para adicionar o canal
            mfccs = np.expand_dims(mfccs, axis=-1)  # Forma (40, 44, 1)
            
            segments.append(mfccs)
        
        segments = np.array(segments)
        
        # Garanta que a forma dos dados seja (num_samples, 40, 44, 1)
        segments = segments.reshape(segments.shape[0], 40, 44, 1)

        # Realiza a predição
        predictions = self.model.predict(segments)
        pred_labels = np.argmax(predictions, axis=1)
        
        # Calcula a porcentagem de segmentos com ronco
        percent_ronco = np.sum(pred_labels) / len(pred_labels) * 100
        
        # Retorna a resposta como um dicionário
        if percent_ronco > threshold:
            return {
                "message": "Sono possivelmente não saudável.",
                "percent_ronco": percent_ronco
            }
        else:
            return {
                "message": "Sono possivelmente saudável.",
                "percent_ronco": percent_ronco
            }


