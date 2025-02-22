import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical  # type: ignore

from models.dataset import download_dataset, load_dataset
from models.model import build_model

class Controller:
    def __init__(self):
        """
        Inicializa a classe Controller, que orquestra o fluxo da aplicação, incluindo o carregamento de dados,
        treinamento do modelo e avaliação de gravações noturnas.

        Atributos:
            model (tensorflow.keras.Model): O modelo de rede neural convolucional (CNN) para classificação de áudio.
            input_shape (tuple): A forma da entrada esperada pelo modelo, determinada a partir dos dados de treino.
        """
        self.model = None
        self.input_shape = None


    def preparar_dados(self):
        """
        Faz o download e carrega os dados, extraindo as features dos áudios e separando os dados em conjuntos
        de treino e teste.

        Etapas realizadas:
            1. Faz o download do dataset utilizando a função 'download_dataset'.
            2. Carrega os dados e extrai as features com a função 'load_dataset'.
            3. Imprime as formas dos arrays de features (X) e rótulos (y).
            4. Divide os dados em conjuntos de treino e teste utilizando 'train_test_split'.
            5. Converte os rótulos para o formato categórico (one-hot encoding) com 'to_categorical'.

        Retorna:
            tuple: Uma tupla contendo:
                    - X_train (numpy.ndarray): Dados de treino.
                    - X_test (numpy.ndarray): Dados de teste.
                    - y_train_cat (numpy.ndarray): Rótulos de treino convertidos para formato categórico.
                    - y_test_cat (numpy.ndarray): Rótulos de teste convertidos para formato categórico.
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
        Constrói, treina e avalia o modelo de rede neural.

        Etapas realizadas:
            1. Define a forma da entrada do modelo com base nos dados de treino (X_train).
            2. Constrói o modelo chamando a função 'build_model' e passando a 'input_shape'.
            3. Exibe o resumo (summary) do modelo.
            4. Treina o modelo utilizando os dados de treino, validando com o conjunto de teste.
            5. Após o treinamento, avalia o modelo no conjunto de teste e imprime a acurácia.

        Parâmetros:
            X_train (numpy.ndarray): Dados de treino.
            X_test (numpy.ndarray): Dados de teste.
            y_train_cat (numpy.ndarray): Rótulos de treino no formato categórico.
            y_test_cat (numpy.ndarray): Rótulos de teste no formato categórico.
            epochs (int, opcional): Número de épocas para o treinamento (padrão: 30).
            batch_size (int, opcional): Tamanho do lote para o treinamento (padrão: 32).

        Retorna:
            None
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
        Processa uma gravação noturna completa, segmenta o áudio e classifica cada segmento para avaliar a saúde do sono.

        Etapas realizadas:
            1. Verifica se o modelo foi treinado; se não, solicita o treinamento.
            2. Carrega a gravação noturna completa utilizando a biblioteca librosa.
            3. Calcula a duração total do áudio e segmenta o áudio em pedaços de duração definida por 'segment_duration' (em segundos).
            4. Para cada segmento, extrai os coeficientes MFCC com 40 coeficientes e expande a dimensão para criar um canal.
            5. Agrupa todos os segmentos em um array e realiza a predição utilizando o modelo treinado.
            6. Converte as predições para rótulos e calcula a porcentagem de segmentos classificados como ronco.
            7. Compara a porcentagem de ronco com um limiar (threshold) e imprime se o sono é possivelmente saudável ou não.

        Parâmetros:
            audio_path (str): Caminho para o arquivo de áudio que contém a gravação noturna.
            segment_duration (float, opcional): Duração (em segundos) de cada segmento para análise. Valor padrão é 1.0 segundo.
            threshold (float, opcional): Percentual de segmentos com ronco que define o limiar para considerar o sono não saudável.
                                        Se a porcentagem de segmentos com ronco for maior que esse valor, o sono é avaliado como possivelmente não saudável.
                                        Valor padrão é 20.

        Retorna:
            None
        """
        if self.model is None:
            print("Modelo não treinado. Treine o modelo antes de avaliar uma gravação noturna.")
            return
        
        # Carrega a gravação completa e obtém a taxa de amostragem
        audio, sample_rate = librosa.load(audio_path, sr=None)
        total_duration = librosa.get_duration(y=audio, sr=sample_rate)
        
        segments = []
        # Segmenta o áudio de acordo com a duração especificada
        for start in np.arange(0, total_duration, segment_duration):
            end = min(start + segment_duration, total_duration)
            segment_audio = audio[int(start * sample_rate):int(end * sample_rate)]
            # Extrai os MFCCs para cada segmento
            mfccs = librosa.feature.mfcc(y=segment_audio, sr=sample_rate, n_mfcc=40)
            mfccs = np.expand_dims(mfccs, axis=-1)
            segments.append(mfccs)
        
        segments = np.array(segments)
        # Realiza a predição dos segmentos utilizando o modelo treinado
        predictions = self.model.predict(segments)
        pred_labels = np.argmax(predictions, axis=1)
        
        # Calcula a porcentagem de segmentos classificados como ronco
        percent_ronco = np.sum(pred_labels) / len(pred_labels) * 100
        print("Porcentagem de segmentos com ronco: {:.2f}%".format(percent_ronco))
        
        # Avalia se o sono é possivelmente saudável com base no limiar definido
        if percent_ronco > threshold:
            print("Sono possivelmente não saudável.")
        else:
            print("Sono possivelmente saudável.")

