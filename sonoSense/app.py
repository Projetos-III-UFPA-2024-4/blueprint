
# /app.py
from controllers.controller import Controller


def main():
    """
    Função principal que orquestra a execução do projeto sonoSense.

    Etapas realizadas:
        1. Cria uma instância do Controller, que gerencia o fluxo da aplicação.
        2. Prepara os dados: faz o download do dataset, extrai as features dos áudios e divide os dados em
            conjuntos de treino e teste (com rótulos convertidos para formato categórico).
        3. Treina o modelo de rede neural utilizando os dados preparados, realizando a validação durante
            o treinamento.
        4. (Opcional) Avalia uma gravação noturna completa para inferir a saúde do sono. Para isso, basta
            descomentar a linha correspondente e fornecer o caminho para o arquivo de áudio.
    """
    ctrl = Controller()
    
    # Preparação dos dados e treinamento do modelo
    X_train, X_test, y_train_cat, y_test_cat = ctrl.preparar_dados()
    ctrl.treinar_modelo(X_train, X_test, y_train_cat, y_test_cat, epochs=30, batch_size=32)
    
    # Exemplo: avaliação de uma gravação noturna
    # Substitua 'caminho_para_audio_noite.wav' pelo caminho real do arquivo de áudio.
    # ctrl.avaliar_noite("caminho_para_audio_noite.wav")


if __name__ == '__main__':
    main()
