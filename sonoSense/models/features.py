# /models/features.py
import numpy as np # type: ignore
import librosa # type: ignore

def extract_features(file_path, n_mfcc=40, fixed_frames=44):
    """
    Extrai os coeficientes MFCC de um arquivo de áudio e padroniza o número de frames.

    Essa função realiza as seguintes etapas:
        1. Carrega o arquivo de áudio a partir do caminho especificado usando a biblioteca librosa.
        2. Calcula os coeficientes MFCC (Mel Frequency Cepstral Coefficients) a partir do sinal de áudio.
        3. Padroniza o número de frames (dimensão temporal) dos MFCCs:
            - Se o número de frames extraídos for menor que `fixed_frames`, a função aplica padding (zeros)
                para complementar até atingir o número desejado.
            - Se o número de frames for maior que `fixed_frames`, a função trunca os frames excedentes.
        4. Expande a dimensão do array de saída para incluir um canal, resultando na forma (n_mfcc, fixed_frames, 1),
            que é adequada para ser utilizada como entrada em modelos de redes neurais convolucionais (CNN).

    Parâmetros:
        file_path (str): Caminho para o arquivo de áudio a ser processado.
        n_mfcc (int, opcional): Número de coeficientes MFCC a serem extraídos. Valor padrão é 40.
        fixed_frames (int, opcional): Número fixo de frames desejado para a dimensão temporal dos MFCCs.
                                    Se o áudio tiver menos frames, será feito padding; se tiver mais, será truncado.
                                    Valor padrão é 44.

    Retorna:
        numpy.ndarray ou None: Um array com os MFCCs de forma (n_mfcc, fixed_frames, 1) se o processamento for bem-sucedido.
                                Se ocorrer um erro durante o processamento, retorna None.
    
    """
    try:
        # Carrega o áudio e obtém a taxa de amostragem
        audio, sample_rate = librosa.load(file_path, sr=None)
        # Extrai os coeficientes MFCC do áudio
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=n_mfcc)
        
        # Padroniza o número de frames para fixed_frames
        if mfccs.shape[1] < fixed_frames:
            pad_width = fixed_frames - mfccs.shape[1]
            mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfccs = mfccs[:, :fixed_frames]
            
        # Expande a dimensão para adicionar o canal (necessário para CNNs)
        mfccs = np.expand_dims(mfccs, axis=-1)
        return mfccs
    except Exception as e:
        print("Erro ao processar {}: {}".format(file_path, e))
        return None
