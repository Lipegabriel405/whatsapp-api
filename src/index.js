const express = require('express');
const { createInstance, sendMessage, getStatus } = require('./whatsapp');
 // Corrigido o caminho para whatsapp.js

const app = express();
app.use(express.json());

// Endpoint para enviar mensagem
app.post('/sendMessage', async (req, res) => {
  const { instanceId, to, message } = req.body;
  try {
    const result = await sendMessage(instanceId, to, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem', details: error });
  }
});

// Endpoint para criar nova instância e gerar QR Code
app.post('/createInstance', async (req, res) => {
  try {
    const instance = await createInstance();
    res.json(instance);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar instância', details: error });
  }
});

// Endpoint para verificar status da instância
app.get('/status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const status = await getStatus(id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar status', details: error });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
