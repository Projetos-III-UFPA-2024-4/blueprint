import mysql.connector  # type: ignore

class AudioModel:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
        self.cursor = None

    def connect(self):
        """Estabelece a conexão com o banco de dados MySQL."""
        if not self.connection or not self.connection.is_connected():
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.connection.is_connected():
                self.cursor = self.connection.cursor()
                print("Conexão com o MySQL estabelecida com sucesso!")

                # Cria a tabela de áudios caso não exista
                self.create_table()

    def create_table(self):
        """Cria a tabela de áudios caso não exista."""
        create_table_query = '''
        CREATE TABLE IF NOT EXISTS audios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            audio_data LONGBLOB NOT NULL
        );
        '''
        self.cursor.execute(create_table_query)
        self.connection.commit()

    def insert_audio(self, audio_name, audio_data):
        """Insere um novo áudio no banco de dados, aceitando dados binários diretamente."""
        try:
            # Insere os dados binários no banco de dados
            insert_query = "INSERT INTO audios (name, audio_data) VALUES (%s, %s)"
            self.cursor.execute(insert_query, (audio_name, audio_data))
            self.connection.commit()

        except Exception as e:
            print(f"Erro ao inserir o áudio: {e}")


    def get_audio(self, audio_id):
        """Recupera um áudio pelo ID."""
        select_query = "SELECT name, audio_data FROM audios WHERE id = %s"
        self.cursor.execute(select_query, (audio_id,))
        result = self.cursor.fetchone()
        if result:
            return result
        return None

    def close_connection(self):
        """Fecha a conexão com o banco de dados."""
        if self.connection.is_connected():
            self.cursor.close()
            self.connection.close()
            print("Conexão com o MySQL encerrada.")

    def get_all_audios(self):
        """Recupera todos os áudios do banco de dados."""
        select_query = "SELECT id, name FROM audios"
        self.cursor.execute(select_query)
        result = self.cursor.fetchall()
        return result
