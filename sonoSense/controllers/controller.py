# controllers/controller.py
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

from models.dataset import download_dataset, load_dataset
from models.model import build_model

class Controller:
    def __init__(self):
        self.model = None
        self.input_shape = None
        
    def preparar_dados(self):
        """
        Faz o download e carrega os dados, extraindo as features e separando em conjuntospy de treino e teste.
        """
        path = download_dataset()
        print("Carregando dataset e extraindo features...")
        X, y = load_dataset(path)
        print("Dataset carregado. Formato de X:", X.shape, "e y:", y.shape)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        # Converte rótulos para categóricos
        y_train_cat = to_categorical(y_train)
        y_test_cat = to_categorical(y_test)
        return X_train, X_test, y_train_cat, y_test_cat
    
    def treinar_modelo(self, X_train, X_test, y_train_cat, y_test_cat, epochs=30, batch_size=32):
        """
        Constrói, treina e avalia o modelo.
        """
        self.input_shape = X_train.shape[1:]
        self.model = build_model(self.input_shape)
        self.model.summary()
        
        self.model.fit(X_train, y_train_cat, epochs=epochs, batch_size=batch_size,
                        validation_data=(X_test, y_test_cat))
        
        loss, accuracy = self.model.evaluate(X_test, y_test_cat)
        print("Acurácia no conjunto de teste: {:.2f}%".format(accuracy * 100))
    
    def avaliar_noite(self, audio_path, segment_duration=1.0, threshold=20):
        """
        Processa uma gravação noturna completa, segmenta o áudio e classifica cada segmento.
        Exibe a porcentagem de segmentos com ronco e a avaliação de saúde do sono.
        """
        if self.model is None:
            print("Modelo não treinado. Treine o modelo antes de avaliar uma gravação noturna.")
            return
        
        audio, sample_rate = librosa.load(audio_path, sr=None)
        total_duration = librosa.get_duration(y=audio, sr=sample_rate)
        
        segments = []
        for start in np.arange(0, total_duration, segment_duration):
            end = min(start + segment_duration, total_duration)
            segment_audio = audio[int(start * sample_rate):int(end * sample_rate)]
            mfccs = librosa.feature.mfcc(y=segment_audio, sr=sample_rate, n_mfcc=40)
            mfccs = np.expand_dims(mfccs, axis=-1)
            segments.append(mfccs)
        
        segments = np.array(segments)
        predictions = self.model.predict(segments)
        pred_labels = np.argmax(predictions, axis=1)
        
        percent_ronco = np.sum(pred_labels) / len(pred_labels) * 100
        print("Porcentagem de segmentos com ronco: {:.2f}%".format(percent_ronco))
        
        if percent_ronco > threshold:
            print("Sono possivelmente não saudável.")
        else:
            print("Sono possivelmente saudável.")
