import os
import numpy as np # type: ignore
from tensorflow.keras.models import load_model # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from tensorflow.keras.utils import to_categorical  # type: ignore

from models.dataset import download_dataset, load_dataset
from models.model import build_model

class Controller:
    def __init__(self):
        """
        Inicializa a classe Controller, que orquestra o fluxo da aplicação, incluindo o carregamento de dados,
        treinamento do modelo e avaliação de gravações noturnas.

        Atributos:
            model (tensorflow.keras.Model): O modelo de rede neural carregado ou None se o modelo não for encontrado.
            input_shape (tuple): Forma da entrada para o modelo, definida pelos dados de treino.
        
        Fluxo:
            - Inicializa o atributo `model`, tentando carregar um modelo treinado previamente (se existir).
            - Define a variável `input_shape` como None, aguardando os dados de treino para definir o formato.
        
        Este é o ponto de entrada para a classe, e é chamado sempre que uma instância de `Controller` é criada.
        """
        self.model = self.carregar_modelo()  # Carrega o modelo salvo, se existir
        self.input_shape = None


    def carregar_modelo(self):
        """
            Carrega o modelo treinado a partir de um arquivo .h5. Se o modelo não existir, retorna None.
            
            Fluxo:
                - Verifica se o arquivo 'modelo_sono.h5' está presente no diretório.
                - Se o arquivo estiver presente, o modelo é carregado com a função `load_model`.
                - Caso contrário, um erro é impresso e `None` é retornado.
            
            Parâmetros:
                Nenhum.
            
            Retorno:
                tensorflow.keras.Model ou None: Retorna o modelo carregado ou None se não for possível carregar.
            
            Exceções:
                Caso ocorra algum erro ao tentar carregar o modelo, uma mensagem de erro é exibida.
            """
        try:
            # Verifica se o arquivo do modelo existe
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
        Faz o download e carrega os dados, extraindo as features dos áudios e separando os dados em conjuntos
        de treino e teste.
        
        Fluxo:
            - Baixa o dataset utilizando `download_dataset`.
            - Carrega os dados do dataset e extrai as características de áudio (MFCC) com `load_dataset`.
            - Divide os dados em conjuntos de treino e teste usando `train_test_split` do Scikit-learn.
            - Converte os rótulos para formato categórico usando `to_categorical` do Keras.

        Parâmetros:
            Nenhum.
        
        Retorno:
            tuple:
                - X_train (numpy.ndarray): Dados de treino (features dos áudios).
                - X_test (numpy.ndarray): Dados de teste (features dos áudios).
                - y_train_cat (numpy.ndarray): Rótulos de treino no formato categórico (one-hot encoding).
                - y_test_cat (numpy.ndarray): Rótulos de teste no formato categórico (one-hot encoding).
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

        Fluxo:
            - O método começa construindo o modelo utilizando a função `build_model`.
            - Em seguida, treina o modelo com os dados de treino (`X_train`, `y_train_cat`) e valida com os dados de teste (`X_test`, `y_test_cat`).
            - Após o treinamento, avalia o desempenho do modelo no conjunto de teste.
            - O modelo treinado é salvo no arquivo 'modelo_sono.h5' para que possa ser reutilizado posteriormente.
        
        Parâmetros:
            X_train (numpy.ndarray): Dados de treino (features dos áudios).
            X_test (numpy.ndarray): Dados de teste (features dos áudios).
            y_train_cat (numpy.ndarray): Rótulos de treino no formato categórico.
            y_test_cat (numpy.ndarray): Rótulos de teste no formato categórico.
            epochs (int, opcional): Número de épocas para o treinamento. Padrão é 30.
            batch_size (int, opcional): Tamanho do lote para o treinamento. Padrão é 32.

        Retorno:
            Nenhum. O modelo é salvo após o treinamento em 'modelo_sono.h5'.
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

        Fluxo:
            - Carrega o áudio completo da gravação noturna com a função `librosa.load`.
            - Segmente o áudio em pedaços de duração `segment_duration` (em segundos).
            - Para cada segmento, extrai os coeficientes MFCC usando a função `librosa.feature.mfcc`.
            - Para cada segmento, realiza uma predição utilizando o modelo treinado.
            - A predição é convertida em rótulos binários (ronco ou não ronco).
            - A porcentagem de segmentos classificados como ronco é calculada.
            - Compara a porcentagem com um limiar (`threshold`) e imprime se o sono é saudável ou não.

        Parâmetros:
            audio_path (str): Caminho para o arquivo de áudio da gravação noturna.
            segment_duration (float, opcional): Duração do segmento de áudio (em segundos). Padrão é 1 segundo.
            threshold (float, opcional): Porcentagem de segmentos classificados como ronco para considerar o sono não saudável. Padrão é 20%.

        Retorno:
            Nenhum. O resultado é impresso na tela indicando se o sono é saudável ou não.
        """
        if self.model is None:
            print("Modelo não treinado. Treine o modelo antes de avaliar uma gravação noturna.")
            return
        
        # Carrega a gravação completa e obtém a taxa de amostragem
        audio, sample_rate = librosa.load(audio_path, sr=None) # type: ignore
        total_duration = librosa.get_duration(y=audio, sr=sample_rate) # type: ignore
        
        segments = []
        # Segmenta o áudio de acordo com a duração especificada
        for start in np.arange(0, total_duration, segment_duration):
            end = min(start + segment_duration, total_duration)
            segment_audio = audio[int(start * sample_rate):int(end * sample_rate)]
            # Extrai os MFCCs para cada segmento
            mfccs = librosa.feature.mfcc(y=segment_audio, sr=sample_rate, n_mfcc=40) # type: ignore
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

