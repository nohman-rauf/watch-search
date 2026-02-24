import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Contact {
  id: string;
  whatsapp_number: string;
  name: string | null;
  wa_link: string;
  first_seen_at: string;
  last_seen_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  message_id: string;
  content: string | null;
  sender_number: string;
  sender_name: string | null;
  contact_id: string | null;
  group_name: string | null;
  group_id: string | null;
  is_group: boolean;
  message_type: string;
  media_url: string | null;
  timestamp: string;
  created_at: string;
}

export interface WhatsAppSession {
  id: string;
  session_data: any;
  phone_number: string | null;
  status: string;
  last_connected_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function saveContact(whatsappNumber: string, name: string | null): Promise<Contact | null> {
  const normalizedNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${normalizedNumber}`;

  const { data: existing } = await supabase
    .from('contacts')
    .select('*')
    .eq('whatsapp_number', normalizedNumber)
    .maybeSingle();

  if (existing) {
    const { data } = await supabase
      .from('contacts')
      .update({
        name: name || existing.name,
        last_seen_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    return data;
  }

  const { data } = await supabase
    .from('contacts')
    .insert({
      whatsapp_number: normalizedNumber,
      name,
      wa_link: waLink
    })
    .select()
    .single();

  return data;
}

export async function saveMessage(messageData: {
  messageId: string;
  content: string | null;
  senderNumber: string;
  senderName: string | null;
  groupName: string | null;
  groupId: string | null;
  isGroup: boolean;
  messageType: string;
  mediaUrl: string | null;
  timestamp: Date;
}): Promise<Message | null> {
  const contact = await saveContact(messageData.senderNumber, messageData.senderName);

  const { data } = await supabase
    .from('messages')
    .insert({
      message_id: messageData.messageId,
      content: messageData.content,
      sender_number: messageData.senderNumber.replace(/[^0-9]/g, ''),
      sender_name: messageData.senderName,
      contact_id: contact?.id,
      group_name: messageData.groupName,
      group_id: messageData.groupId,
      is_group: messageData.isGroup,
      message_type: messageData.messageType,
      media_url: messageData.mediaUrl,
      timestamp: messageData.timestamp.toISOString()
    })
    .select()
    .single();

  return data;
}

export async function searchMessages(query: {
  search?: string;
  groupName?: string;
  sender?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}) {
  let queryBuilder = supabase
    .from('messages')
    .select('*, contacts(*)', { count: 'exact' });

  if (query.search) {
    queryBuilder = queryBuilder.or(`content.ilike.%${query.search}%,sender_name.ilike.%${query.search}%,group_name.ilike.%${query.search}%`);
  }

  if (query.groupName) {
    queryBuilder = queryBuilder.ilike('group_name', `%${query.groupName}%`);
  }

  if (query.sender) {
    queryBuilder = queryBuilder.or(`sender_number.ilike.%${query.sender}%,sender_name.ilike.%${query.sender}%`);
  }

  if (query.dateFrom) {
    queryBuilder = queryBuilder.gte('timestamp', query.dateFrom);
  }

  if (query.dateTo) {
    queryBuilder = queryBuilder.lte('timestamp', query.dateTo);
  }

  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const { data, error, count } = await queryBuilder
    .order('timestamp', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error, count };
}

export async function saveSession(sessionData: any, phoneNumber: string | null, status: string) {
  const { data: existing } = await supabase
    .from('whatsapp_sessions')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { data } = await supabase
      .from('whatsapp_sessions')
      .update({
        session_data: sessionData,
        phone_number: phoneNumber,
        status,
        last_connected_at: status === 'connected' ? new Date().toISOString() : existing.last_connected_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    return data;
  }

  const { data } = await supabase
    .from('whatsapp_sessions')
    .insert({
      session_data: sessionData,
      phone_number: phoneNumber,
      status,
      last_connected_at: status === 'connected' ? new Date().toISOString() : null
    })
    .select()
    .single();

  return data;
}

export async function getSession(): Promise<WhatsAppSession | null> {
  const { data } = await supabase
    .from('whatsapp_sessions')
    .select('*')
    .limit(1)
    .maybeSingle();

  return data;
}
