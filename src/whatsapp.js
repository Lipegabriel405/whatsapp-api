const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');
const path = require('path');

const instances = {}; // Armazena instâncias ativas

// Função para criar uma nova instância e gerar QR Code
async function createInstance() {
  const conn = new WAConnection();
  const instanceId = new Date().getTime().toString();  // ID único para a instância

  // Caminho para armazenar a sessão (para não precisar escanear QR toda vez)
  const sessionPath = path.join(__dirname, '../sessions', `${instanceId}.json`);

  if (fs.existsSync(sessionPath)) {
    const session = require(sessionPath);
    conn.loadAuthInfo(session);
  }

  conn.on('qr', (qr) => {
    console.log(`QR RECEIVED: ${qr}`);
  });

  conn.on('open', () => {
    console.log('Conectado ao WhatsApp!');
    fs.writeFileSync(sessionPath, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'));
  });

  await conn.connect();
  instances[instanceId] = conn;
  return { instanceId, message: 'Instância criada com sucesso! QR Code gerado no terminal' };
}

// Função para enviar mensagem
async function sendMessage(instanceId, to, message) {
  const conn = instances[instanceId];
  if (!conn) {
    throw new Error('Instância não encontrada');
  }
  const result = await conn.sendMessage(to, message, MessageType.text);
  return { instanceId, to, result };
}

// Função para verificar status
async function getStatus(id) {
  const conn = instances[id];
  if (!conn) {
    throw new Error('Instância não encontrada');
  }
  const status = conn.isOpen ? 'Conectado' : 'Desconectado';
  return { instanceId: id, status };
}

module.exports = { createInstance, sendMessage, getStatus };
