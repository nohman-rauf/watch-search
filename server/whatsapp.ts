import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  WAMessage,
  WASocket,
  BaileysEventMap
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';
import * as path from 'path';
import P from 'pino';
import QRCode from 'qrcode';
import { saveMessage, saveSession } from './db';

const logger = P({ level: 'silent' });

export class WhatsAppClient {
  private sock: WASocket | null = null;
  private qrCode: string | null = null;
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private authFolder = path.join(process.cwd(), 'auth_info');

  constructor() {
    if (!fs.existsSync(this.authFolder)) {
      fs.mkdirSync(this.authFolder, { recursive: true });
    }
  }

  async connect() {
    try {
      console.log('WhatsApp connect() called, setting status to connecting...');
      this.connectionStatus = 'connecting';
      const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);
      console.log('Auth state loaded');
      const { version } = await fetchLatestBaileysVersion();
      console.log('Baileys version fetched:', version);

      this.sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        auth: state,
        getMessage: async () => undefined
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log('QR Code received from Baileys, converting to data URL...');
          this.qrCode = await QRCode.toDataURL(qr);
          console.log('QR Code generated successfully, length:', this.qrCode?.length);
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);

          this.connectionStatus = 'disconnected';
          await saveSession(null, null, 'disconnected');

          if (shouldReconnect) {
            setTimeout(() => this.connect(), 3000);
          }
        } else if (connection === 'open') {
          console.log('WhatsApp connected successfully!');
          this.connectionStatus = 'connected';
          this.qrCode = null;

          const phoneNumber = this.sock?.user?.id?.split(':')[0] || null;
          await saveSession(state.creds, phoneNumber, 'connected');
        }
      });

      this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
          for (const message of messages) {
            await this.handleMessage(message);
          }
        }
      });

    } catch (error) {
      console.error('Error connecting to WhatsApp:', error);
      this.connectionStatus = 'disconnected';
      await saveSession(null, null, 'disconnected');
    }
  }

  private async handleMessage(message: WAMessage) {
    try {
      if (!message.key.fromMe && message.message) {
        const messageType = Object.keys(message.message)[0];
        const isGroup = message.key.remoteJid?.endsWith('@g.us') || false;

        let content: string | null = null;
        let mediaUrl: string | null = null;
        let msgType = 'text';

        if (message.message.conversation) {
          content = message.message.conversation;
        } else if (message.message.extendedTextMessage) {
          content = message.message.extendedTextMessage.text || null;
        } else if (message.message.imageMessage) {
          content = message.message.imageMessage.caption || null;
          msgType = 'image';
        } else if (message.message.videoMessage) {
          content = message.message.videoMessage.caption || null;
          msgType = 'video';
        } else if (message.message.documentMessage) {
          content = message.message.documentMessage.fileName || null;
          msgType = 'document';
        }

        const senderNumber = message.key.participant || message.key.remoteJid || '';
        const senderNumberClean = senderNumber.split('@')[0];

        let groupName: string | null = null;
        let groupId: string | null = null;

        if (isGroup && message.key.remoteJid) {
          groupId = message.key.remoteJid;
          try {
            const groupMetadata = await this.sock?.groupMetadata(groupId);
            groupName = groupMetadata?.subject || null;
          } catch (err) {
            console.error('Error fetching group metadata:', err);
          }
        }

        const pushName = message.pushName || null;

        await saveMessage({
          messageId: message.key.id || `${Date.now()}-${Math.random()}`,
          content,
          senderNumber: senderNumberClean,
          senderName: pushName,
          groupName,
          groupId,
          isGroup,
          messageType: msgType,
          mediaUrl,
          timestamp: new Date(message.messageTimestamp ? Number(message.messageTimestamp) * 1000 : Date.now())
        });

        console.log(`Message saved from ${pushName || senderNumberClean} ${isGroup ? `in ${groupName}` : ''}`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  getQRCode(): string | null {
    return this.qrCode;
  }

  getStatus(): string {
    return this.connectionStatus;
  }

  async disconnect() {
    if (this.sock) {
      await this.sock.logout();
      this.sock = null;
      this.connectionStatus = 'disconnected';
      this.qrCode = null;

      if (fs.existsSync(this.authFolder)) {
        fs.rmSync(this.authFolder, { recursive: true, force: true });
      }

      await saveSession(null, null, 'disconnected');
    }
  }

  isConnected(): boolean {
    return this.connectionStatus === 'connected';
  }
}

export const whatsappClient = new WhatsAppClient();
