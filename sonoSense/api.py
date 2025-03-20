import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.controller import Controller
from models.audio_model import AudioModel
from pydub import AudioSegment
from pydub.utils import which

# Garantir que o pydub use o ffmpeg corretamente
AudioSegment.ffmpeg = which("ffmpeg")

app = Flask(__name__)

CORS(app)

logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

controller = Controller()

db_config = {
    'host': '89.116.74.250',
    'port': 3307,  
    'user': 'dbaudio',
    'password': 'dbaudio',
    'database': 'dbaudio'
}

audio_model = AudioModel(**db_config)
audio_model.connect()


def converter_audio_para_wav(input_path, output_path):
    try:
        # Verificar o tipo de formato antes de converter
        audio = AudioSegment.from_file(input_path)
        audio.export(output_path, format="wav")
        return output_path
    except Exception as e:
        app.logger.error(f"Erro ao converter áudio para WAV: {e}")
        return None


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

        # Converter áudio para WAV (funciona com MP3, AAC, etc.)
        wav_path = file_path.replace(os.path.splitext(file_path)[1], ".wav")
        wav_file = converter_audio_para_wav(file_path, wav_path)

        if wav_file:
            # Agora use o arquivo WAV para o processamento
            resultado = controller.avaliar_noite(wav_file)

            # Se o processamento for bem-sucedido, insira os dados no banco de dados
            if "message" in resultado and "percent_ronco" in resultado:
                audio_model.insert_audio(None, audio_filename, audio_file.read(), resultado["message"], resultado["percent_ronco"])
            else:
                app.logger.error(f"Erro no resultado da avaliação: {str(resultado)}")
                return jsonify({"error": "Erro ao avaliar o áudio."}), 500

            os.remove(file_path)  # Remover o arquivo temporário
            os.remove(wav_path)  # Remover o arquivo WAV convertido
            app.logger.info(f"Arquivo {file_path} e {wav_path} excluídos após o processamento.")

            return jsonify(resultado), 200

        return jsonify({"error": "Falha na conversão do arquivo para WAV."}), 500

    except Exception as e:
        app.logger.error(f"Erro durante o processamento do áudio: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/listar_audios', methods=['GET'])
def listar_audios():
    try:
        audios = audio_model.get_all_audios()

        audio_list = []
        for audio in audios:
            audio_list.append({
                'id': audio[0],
                'name': audio[1],
                'resultado': audio[2],
                'percent_ronco': audio[3]
            })

        return jsonify(audio_list), 200

    except Exception as e:
        app.logger.error(f"Erro ao listar os áudios: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/listar_audio_recente', methods=['GET'])
def listar_audio_recente():
    try:
        # Recuperar o áudio mais recente do banco de dados
        audio = audio_model.get_latest_audio()

        if not audio:
            return jsonify({"message": "Nenhum áudio encontrado."}), 404

        # Preparar o dado do áudio para exibição
        audio_data = {
            'id': audio[0],
            'name': audio[1],
            'resultado': audio[2],
            'percent_ronco': audio[3]
        }

        return jsonify(audio_data), 200

    except Exception as e:
        app.logger.error(f"Erro ao listar o áudio: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/teste', methods=['GET'])
def home():
    app.logger.info("Rota /teste acessada")
    return jsonify({"message": "Avaliação concluída com sucesso!"}), 200


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5179)
