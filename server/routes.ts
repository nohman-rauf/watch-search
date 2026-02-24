import { Router } from 'express';
import { whatsappClient } from './whatsapp';
import { searchMessages, getSession } from './db';
import { loginAdmin, createAdmin, authenticateToken } from './auth';

const router = Router();

router.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, error } = await loginAdmin(email, password);

    if (error) {
      return res.status(401).json({ error });
    }

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await createAdmin(email, password);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Admin created successfully', admin: data });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/api/whatsapp/connect', async (req, res) => {
  try {
    console.log('WhatsApp connect endpoint called');
    await whatsappClient.connect();
    console.log('WhatsApp connect method completed');
    res.json({ message: 'Connection initiated' });
  } catch (error) {
    console.error('Error in connect endpoint:', error);
    res.status(500).json({ error: 'Failed to connect' });
  }
});

router.get('/api/whatsapp/qr', async (req, res) => {
  try {
    const qrCode = whatsappClient.getQRCode();
    console.log('QR code request - QR code available:', !!qrCode);
    if (qrCode) {
      res.json({ qrCode });
    } else {
      res.json({ qrCode: null, message: 'No QR code available' });
    }
  } catch (error) {
    console.error('Error getting QR code:', error);
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

router.get('/api/whatsapp/status', async (req, res) => {
  try {
    const status = whatsappClient.getStatus();
    const session = await getSession();
    res.json({
      status,
      phoneNumber: session?.phone_number,
      lastConnected: session?.last_connected_at
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

router.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    await whatsappClient.disconnect();
    res.json({ message: 'Disconnected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

router.get('/api/messages/search', async (req, res) => {
  try {
    const {
      search,
      groupName,
      sender,
      dateFrom,
      dateTo,
      limit,
      offset
    } = req.query;

    const { data, error, count } = await searchMessages({
      search: search as string,
      groupName: groupName as string,
      sender: sender as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ messages: data, total: count });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/api/groups', async (req, res) => {
  try {
    const { data, error } = await searchMessages({ limit: 1000 });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const groups = [...new Set(data?.filter(m => m.is_group).map(m => m.group_name).filter(Boolean))];
    res.json({ groups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

export default router;
