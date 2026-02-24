# Luxury Watch Trading Platform

A full-stack web application for luxury watch trading with WhatsApp integration. This system connects to WhatsApp groups, stores messages in a database, and provides a searchable interface for finding watches and contacting sellers.

## Features

- **WhatsApp Integration**: Connect your WhatsApp account using QR code
- **Message Storage**: Automatically captures and stores messages from groups and chats
- **Advanced Search**: Search by watch brand, model, reference number, keywords
- **Smart Filters**: Filter by group name, sender, date range
- **Contact Sellers**: One-click WhatsApp contact with original message sender
- **Admin Panel**: Secure admin interface for managing WhatsApp connection
- **Real-time Status**: Live connection status and QR code display

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- @whiskeysockets/baileys (WhatsApp Web API)
- Supabase (PostgreSQL database)
- JWT authentication

### Frontend
- React 18
- TypeScript
- React Router
- Tailwind CSS
- Lucide React (icons)

## Prerequisites

- Node.js 18+
- Supabase account and project
- WhatsApp account

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=3001
```

### 3. Database Setup

The database schema is already applied through Supabase migrations. Tables created:
- `admins` - Admin users
- `whatsapp_sessions` - WhatsApp connection sessions
- `contacts` - Unique WhatsApp contacts
- `messages` - All captured messages

### 4. Create Admin Account

You need to create an admin account first. You can do this by making a POST request to the registration endpoint:

```bash
curl -X POST http://localhost:3001/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_secure_password"}'
```

Or use a tool like Postman/Insomnia to send the request.

### 5. Run the Application

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Usage Guide

### Admin Panel

1. Navigate to `/login` and sign in with your admin credentials
2. Go to Admin Panel via the navigation menu
3. Click "Connect WhatsApp" to generate a QR code
4. Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
5. Scan the QR code displayed in the admin panel
6. Wait for connection confirmation

### Search Interface

1. Visit the home page to access the search interface
2. Use the search bar to find watches by:
   - Brand name (Rolex, Patek Philippe, etc.)
   - Model name
   - Reference numbers
   - Keywords
3. Apply filters:
   - Select specific WhatsApp groups
   - Filter by sender
   - Set date ranges
4. Click "Contact Seller" to open WhatsApp chat with the seller

## API Endpoints

### Authentication
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Admin login

### WhatsApp
- `POST /api/whatsapp/connect` - Initiate WhatsApp connection (protected)
- `GET /api/whatsapp/qr` - Get current QR code (protected)
- `GET /api/whatsapp/status` - Get connection status (public)
- `POST /api/whatsapp/disconnect` - Disconnect WhatsApp (protected)

### Messages
- `GET /api/messages/search` - Search messages with filters (public)
- `GET /api/groups` - Get list of all groups (public)

## Security Features

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication for admin routes
- Bcrypt password hashing
- Public read-only access to messages (for search)
- Admin-only write access

## Message Handling

The system automatically captures:
- Text messages
- Image messages (with captions)
- Video messages (with captions)
- Document messages (with filenames)
- Sender information (number and name)
- Group information (name and ID)
- Timestamps

## Data Storage

All data is stored in Supabase PostgreSQL with:
- Full-text search indexing on message content
- Indexed columns for fast filtering
- Automatic contact deduplication
- Generated WhatsApp contact links

## Troubleshooting

### WhatsApp Connection Issues
- Ensure phone has stable internet connection
- Try disconnecting and reconnecting
- Check if QR code has expired (refresh if needed)
- Verify WhatsApp Web is not blocked on your network

### Search Not Working
- Check if backend server is running on port 3001
- Verify Supabase connection credentials
- Check browser console for errors

### Messages Not Being Saved
- Verify WhatsApp connection status is "connected"
- Check server logs for errors
- Ensure database RLS policies are correctly set

## Production Deployment

1. Set strong `JWT_SECRET` in production environment
2. Use HTTPS for all connections
3. Configure proper CORS settings
4. Set up process manager (PM2) for backend
5. Use proper Supabase production database
6. Enable rate limiting on API endpoints

## License

MIT

## Support

For issues and questions, please check the troubleshooting section or review server logs.
