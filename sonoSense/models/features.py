# /models/features.py
import numpy as np # type: ignore
import librosa # type: ignore

def extract_features(file_path, n_mfcc=40, fixed_frames=44):
    """
    Extrai os coeficientes MFCC de um arquivo de áudio e padroniza o número de frames.
    
    Parâmetros:
        file_path (str): Caminho para o arquivo de áudio a ser processado.
        n_mfcc (int, opcional): Número de coeficientes MFCC a serem extraídos. Valor padrão é 40.
        fixed_frames (int, opcional): Número fixo de frames desejado para a dimensão temporal dos MFCCs.

    Retorna:
        numpy.ndarray ou None: Um array com os MFCCs de forma (n_mfcc, fixed_frames, 1) se o processamento for bem-sucedido.
    """
    try:
        # Carrega o áudio e obtém a taxa de amostragem
        audio, sample_rate = librosa.load(file_path, sr=None)
        
        # Extrai os coeficientes MFCC
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=n_mfcc)

        # Padroniza o número de frames
        if mfccs.shape[1] < fixed_frames:
            pad_width = fixed_frames - mfccs.shape[1]
            mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfccs = mfccs[:, :fixed_frames]
        
        # Expande a dimensão para adicionar o canal (necessário para CNNs)
        mfccs = np.expand_dims(mfccs, axis=-1)
        return mfccs
    except Exception as e:
        print(f"Erro ao processar {file_path}: {e}")
        return None