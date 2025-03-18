from controllers.controller import Controller

def main():
    """
    Função principal que orquestra a execução do projeto sonoSense.
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
