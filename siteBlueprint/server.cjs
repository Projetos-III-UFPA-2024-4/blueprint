const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
const baseDir = `${__dirname}/dist/`;

app.use(cors()); 
app.use(express.static(baseDir));
app.use(express.json());

app.post('/save', (req, res) => {
    const data = req.body;

    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, fileData) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(fileData);
        } catch (err) {
            jsonData = [];
        }

        jsonData.push(data);

        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao salvar os dados' });
            }
            res.status(200).json({ message: 'Dados salvos com sucesso' });
        });
    });
});

app.get('*', (req, res) => res.sendFile('index.html', { root: baseDir }));
app.listen(port, () => console.log(`Servidor subiu com sucesso na porta ${port}`));