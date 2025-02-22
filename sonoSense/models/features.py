import numpy as np
import librosa

def extract_features(file_path, n_mfcc=40):
    """
    Extrai os coeficientes MFCC de um arquivo de áudio.
    Retorna um array com as features e expande a dimensão para compatibilidade com CNN.
    """
    try:
        audio, sample_rate = librosa.load(file_path, sr=None)
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=n_mfcc)
        mfccs = np.expand_dims(mfccs, axis=-1)
        return mfccs
    except Exception as e:
        print(f"Erro ao processar {file_path}: {e}")
        return None
