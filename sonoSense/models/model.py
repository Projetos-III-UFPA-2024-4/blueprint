from tensorflow.keras.models import Sequential  # type: ignore
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout  # type: ignore

def build_model(input_shape):
    """
    Constrói e retorna um modelo de rede neural convolucional (CNN) para classificação de áudio.
    
    Parâmetros:
        input_shape (tuple): A forma da entrada para o modelo, por exemplo, (40, 44, 1).
    
    Retorno:
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
