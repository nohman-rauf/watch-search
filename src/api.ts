const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Message {
  id: string;
  message_id: string;
  content: string | null;
  sender_number: string;
  sender_name: string | null;
  group_name: string | null;
  is_group: boolean;
  message_type: string;
  timestamp: string;
  contacts?: {
    wa_link: string;
    name: string | null;
  };
}

export interface SearchParams {
  search?: string;
  groupName?: string;
  sender?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface WhatsAppStatus {
  status: string;
  phoneNumber: string | null;
  lastConnected: string | null;
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function register(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_URL}/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }
}

export async function connectWhatsApp(): Promise<void> {
  const response = await fetch(`${API_URL}/whatsapp/connect`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to connect');
  }
}

export async function disconnectWhatsApp(): Promise<void> {
  const response = await fetch(`${API_URL}/whatsapp/disconnect`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to disconnect');
  }
}

export async function getQRCode(): Promise<{ qrCode: string | null }> {
  const response = await fetch(`${API_URL}/whatsapp/qr`);

  if (!response.ok) {
    throw new Error('Failed to get QR code');
  }

  return response.json();
}

export async function getWhatsAppStatus(): Promise<WhatsAppStatus> {
  const response = await fetch(`${API_URL}/whatsapp/status`);

  if (!response.ok) {
    throw new Error('Failed to get status');
  }

  return response.json();
}

export async function searchMessages(params: SearchParams): Promise<{ messages: Message[]; total: number }> {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append('search', params.search);
  if (params.groupName) queryParams.append('groupName', params.groupName);
  if (params.sender) queryParams.append('sender', params.sender);
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());

  const response = await fetch(`${API_URL}/messages/search?${queryParams}`);

  if (!response.ok) {
    throw new Error('Search failed');
  }

  return response.json();
}

export async function getGroups(): Promise<{ groups: string[] }> {
  const response = await fetch(`${API_URL}/groups`);

  if (!response.ok) {
    throw new Error('Failed to get groups');
  }

  return response.json();
}
