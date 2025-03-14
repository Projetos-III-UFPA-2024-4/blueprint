# /models/dataset.py
import os
import sys
import numpy as np # type: ignore
import kagglehub # type: ignore
from models.features import extract_features


def download_dataset():
    """
    Faz o download do dataset de ronco utilizando a biblioteca kagglehub e retorna o caminho
    onde os arquivos foram salvos.

    A função realiza as seguintes etapas:
      1. Utiliza a função `kagglehub.dataset_download` para baixar o dataset identificado pelo
            nome "tareqkhanemu/snoring".
        2. Imprime no console o caminho para o diretório onde os arquivos do dataset foram armazenados.
        3. Retorna o caminho obtido para que outras funções possam acessar os arquivos do dataset.

    Retorna:
        str: O caminho para o diretório onde o dataset foi baixado.
    """
    path = kagglehub.dataset_download("tareqkhanemu/snoring")
    print("Path to dataset files:", path)
    return path


def load_dataset(path):
    """
    Carrega os dados do dataset de ronco a partir dos diretórios especificados e extrai as features dos áudios.

    O dataset possui a seguinte estrutura:
        - Dentro do diretório base retornado por `download_dataset()`, existe uma pasta "Snoring Dataset".
        - Dentro da pasta "Snoring Dataset", há duas subpastas:
            "1": Contém os áudios de ronco (rótulo 1).
            "0": Contém os áudios de não ronco (rótulo 0).

    A função executa os seguintes passos:
        1. Define o caminho base para os dados combinando o caminho fornecido com a pasta "Snoring Dataset".
        2. Cria caminhos para as duas categorias de áudio, utilizando as subpastas "1" e "0".
        3. Para cada arquivo de áudio em cada subpasta:
            - Extrai os coeficientes MFCC utilizando a função `extract_features`.
            - Se a extração for bem-sucedida, armazena as features em uma lista e atribui o rótulo correspondente (1 para ronco, 0 para não ronco).
        4. Converte as listas de features e rótulos para arrays do NumPy, garantindo que os dados estejam em formato homogêneo.

    Parâmetros:
        path (str): Caminho para o diretório onde o dataset foi baixado (obtido através de `download_dataset()`).

    Retorna:
        tuple: Uma tupla contendo dois arrays do NumPy:
                - features: Um array contendo as features extraídas dos áudios.
                - labels: Um array contendo os rótulos correspondentes (1 para ronco, 0 para não ronco).
    """
    base_folder = os.path.join(path, "Snoring Dataset")
    folder_snore = os.path.join(base_folder, "1")
    folder_non_snore = os.path.join(base_folder, "0")
    
    features = []
    labels = []
    
    # Processa os áudios de ronco (rótulo 1)
    for filename in os.listdir(folder_snore):
        file_path = os.path.join(folder_snore, filename)
        data = extract_features(file_path)
        if data is not None:
            features.append(data)
            labels.append(1)
    
    # Processa os áudios de não ronco (rótulo 0)
    for filename in os.listdir(folder_non_snore):
        file_path = os.path.join(folder_non_snore, filename)
        data = extract_features(file_path)
        if data is not None:
            features.append(data)
            labels.append(0)
    
    return np.array(features), np.array(labels)

