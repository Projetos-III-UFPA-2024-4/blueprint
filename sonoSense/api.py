import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS  # type: ignore
from controllers.controller import Controller
from models.audio_model import AudioModel

# Configuração do Flask
app = Flask(__name__)

# Adicionando CORS à aplicação Flask
CORS(app)

# Configuração de log para o Flask
logging.basicConfig(level=logging.DEBUG)  # Configuração de log para capturar DEBUG e INFO
app.logger.setLevel(logging.DEBUG)  # Definir nível de log do app para DEBUG

# Instancia o Controller e o modelo de áudio
controller = Controller()

# Configurações do banco de dados
db_config = {
    'host': '89.116.74.250',
    'port': 3307,  # Altere para sua porta
    'user': 'dbaudio',
    'password': 'dbaudio',
    'database': 'dbaudio'
}

# Cria o modelo de áudio e conecta ao banco de dados
audio_model = AudioModel(**db_config)
audio_model.connect()

@app.route('/avaliar_sono', methods=['POST'])
@app.route('/avaliar_sono', methods=['POST'])
def avaliar_sono():
    try:
        if 'audio' not in request.files:
            app.logger.error("Arquivo de áudio não encontrado")
            return jsonify({"error": "Arquivo de áudio não encontrado"}), 400
        
        audio_file = request.files['audio']
        audio_filename = audio_file.filename

        # Definir o caminho para salvar o arquivo temporariamente em 'uploads/'
        file_path = os.path.join('uploads', audio_filename)

        # Verificar se a pasta 'uploads/' existe, caso contrário, criar
        if not os.path.exists('uploads'):
            os.makedirs('uploads')

        # Salvar o arquivo temporariamente na pasta uploads/
        audio_file.save(file_path)
        app.logger.info(f"Arquivo de áudio salvo temporariamente em {file_path}")

        # Ler os dados binários diretamente do arquivo
        audio_data = audio_file.read()  # Lê o conteúdo binário do arquivo de áudio

        # Armazenar o áudio no banco de dados como binário
        audio_model.insert_audio(audio_filename, audio_data)

        if controller.model is None:
            return jsonify({"error": "Modelo não carregado. Necessário treinar o modelo primeiro."}), 400
        
        # Chamando a função de avaliação e armazenando o resultado
        resultado = controller.avaliar_noite(file_path)

        # Excluir o arquivo após o processamento
        os.remove(file_path)
        app.logger.info(f"Arquivo {file_path} excluído após o processamento.")

        print(jsonify(resultado))
        return jsonify(resultado), 200  # Retorna o resultado como JSON

    except Exception as e:
        app.logger.error(f"Erro durante o processamento do áudio: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/listar_audios', methods=['GET'])
def listar_audios():
    try:
        # Recuperar todos os áudios do banco de dados
        audios = audio_model.get_all_audios()

        # Preparar uma lista com os dados dos áudios para exibição
        audio_list = []
        for audio in audios:
            audio_list.append({
                'id': audio[0],
                'name': audio[1]
            })

        return jsonify(audio_list), 200

    except Exception as e:
        app.logger.error(f"Erro ao listar os áudios: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/teste', methods=['GET'])
def home():
    app.logger.info("Rota /teste acessada")
    return jsonify({"message": "Avaliação concluída com sucesso!"}), 200

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5179)
