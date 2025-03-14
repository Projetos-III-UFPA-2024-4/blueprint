# /models/model.py
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout # type: ignore

def build_model(input_shape):
    """
    Constrói, compila e retorna um modelo de rede neural convolucional (CNN) para classificação de áudio.

    O modelo é estruturado da seguinte forma:
      - Uma camada de Convolução 2D com 32 filtros, kernel de tamanho (3, 3) e função de ativação ReLU,
        seguida de uma camada de MaxPooling2D com tamanho de pool (2, 2) para reduzir a dimensionalidade.
      - Uma camada de Dropout com taxa de 0.3 para mitigar o overfitting.
      - Uma segunda camada de Convolução 2D com 64 filtros e kernel de tamanho (3, 3) com ativação ReLU,
        seguida de outra camada de MaxPooling2D e Dropout (0.3).
      - A camada Flatten para transformar os mapas de ativação 2D em um vetor unidimensional.
      - Uma camada Dense com 128 neurônios e ativação ReLU.
        - Uma camada Dropout com taxa de 0.3 para regularização adicional.
        - A camada final Dense com 2 neurônios e ativação softmax, representando as duas classes de saída (ex.: ronco e não ronco).

    Após a construção, o modelo é compilado utilizando:
        - Função de perda: 'categorical_crossentropy'
        - Otimizador: 'adam'
        - Métrica: 'accuracy'

    Parâmetros:
        input_shape (tuple): Uma tupla que define a forma da entrada para a CNN. Por exemplo, (n_mfcc, fixed_frames, 1),
                            onde n_mfcc é o número de coeficientes MFCC e fixed_frames é o número de frames padronizados.

    Retorna:
        tensorflow.keras.models.Sequential: O modelo compilado pronto para treinamento.
    """
    model = Sequential([
        Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=input_shape),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.3),
        
        Conv2D(64, kernel_size=(3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.3),
        
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(2, activation='softmax')  # 2 classes: ronco e não ronco
    ])
    
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model
