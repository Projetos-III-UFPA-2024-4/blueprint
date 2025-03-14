from flask import Flask, request, jsonify # type: ignore
from controllers.controller import Controller
import os
import sys

app = Flask(__name__)

# Inicializa o controlador que gerencia o fluxo do modelo
controller = Controller()

@app.route('/avaliar_sono', methods=['POST'])
def avaliar_sono():
    """
        Rota que recebe um arquivo de áudio de uma noite de sono e retorna a classificação
        sobre a saúde do sono (saudável ou não saudável).
        
        Fluxo:
            1. Verifica se o arquivo de áudio foi enviado na requisição. Se não, retorna um erro.
            2. Salva o arquivo de áudio enviado no diretório 'uploads'.
            3. Verifica se o modelo foi carregado corretamente. Se não, retorna um erro.
            4. Chama a função `avaliar_noite` do controlador para processar o áudio e avaliar o sono.
            5. Após o processamento, o arquivo de áudio é removido para evitar acumulação de arquivos temporários.
            6. Retorna uma mensagem de sucesso ou erro.
        
        Parâmetros:
            Nenhum. O arquivo de áudio é enviado na requisição como um arquivo com a chave 'audio'.
        
        Retorno:
            json: Um objeto JSON contendo:
                - `message`: Mensagem indicando o status da avaliação (sucesso ou falha).
                - `error`: Mensagem de erro, caso algo tenha dado errado.
            
            O código de resposta HTTP também é retornado, onde:
                - 200: Caso a avaliação tenha sido bem-sucedida.
                - 400: Caso não haja arquivo de áudio ou o modelo não tenha sido carregado.
                - 500: Caso ocorra algum erro interno no processamento.
        """
    try:
        # Verifica se o arquivo foi enviado na requisição
        if 'audio' not in request.files:
            return jsonify({"error": "Arquivo de áudio não encontrado"}), 400
        
        audio_file = request.files['audio']
        
        # Salva o arquivo enviado
        file_path = os.path.join('uploads', audio_file.filename)
        audio_file.save(file_path)
        
        if controller.model is None:
            return jsonify({"error": "Modelo não carregado. Necessário treinar o modelo primeiro."}), 400
        
        # Avalia a gravação noturna
        controller.avaliar_noite(file_path)

        # Opcionalmente, exclua o arquivo após o processamento
        os.remove(file_path)

        return jsonify({"message": "Avaliação concluída com sucesso!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/teste', methods=['GET'])
def home():
    return jsonify({"message": "Avaliação concluída com sucesso!"}), 200



if __name__ == '__main__':
    # Inicia o servidor Flask
    app.run(debug=False, host='0.0.0.0', port=5179)