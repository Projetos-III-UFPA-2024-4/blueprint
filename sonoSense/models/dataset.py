# models/dataset.py
import os
import numpy as np
import kagglehub
from models.features import extract_features

def download_dataset():
    """
    Faz o download do dataset e retorna o caminho onde os arquivos foram salvos.
    """
    path = kagglehub.dataset_download("tareqkhanemu/snoring")
    print("Path to dataset files:", path)
    return path

def load_dataset(path):
    """
    Carrega os dados do dataset a partir dos diretórios 'Folder 1' (ronco) e 'Folder 0' (não ronco).
    Retorna as features e os respectivos rótulos.
    """
    folder_snore = os.path.join(path, "Folder 1")
    folder_non_snore = os.path.join(path, "Folder 0")
    
    features = []
    labels = []
    
    # Áudios de ronco (rótulo 1)
    for filename in os.listdir(folder_snore):
        file_path = os.path.join(folder_snore, filename)
        data = extract_features(file_path)
        if data is not None:
            features.append(data)
            labels.append(1)
    
    # Áudios de não ronco (rótulo 0)
    for filename in os.listdir(folder_non_snore):
        file_path = os.path.join(folder_non_snore, filename)
        data = extract_features(file_path)
        if data is not None:
            features.append(data)
            labels.append(0)
    
    return np.array(features), np.array(labels)
