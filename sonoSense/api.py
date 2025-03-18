from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from controllers.controller import Controller
import os

app = Flask(__name__)

# Adicionando CORS à aplicação Flask
CORS(app)

controller = Controller()

@app.route('/avaliar_sono', methods=['POST'])
def avaliar_sono():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "Arquivo de áudio não encontrado"}), 400
        
        audio_file = request.files['audio']
        file_path = os.path.join('uploads', audio_file.filename)
        audio_file.save(file_path)
        
        if controller.model is None:
            return jsonify({"error": "Modelo não carregado. Necessário treinar o modelo primeiro."}), 400
        
        # Chamando a função de avaliação e armazenando o resultado
        resultado = controller.avaliar_noite(file_path)
        

        return jsonify(resultado), 200  # Retorna o resultado como JSON

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/teste', methods=['GET'])
def home():
    return jsonify({"message": "Avaliação concluída com sucesso!"}), 200

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5179)
