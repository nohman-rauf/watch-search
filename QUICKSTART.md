# Quick Start Guide

Get your Luxury Watch Trading Platform up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_random_secret_key_min_32_chars
PORT=3001
```

Get your Supabase credentials from your Supabase project dashboard at https://supabase.com

## 3. Create Admin Account

Run the interactive admin creation script:

```bash
npm run create-admin
```

Enter your desired admin email and password when prompted.

## 4. Start the Application

```bash
npm run dev
```

This starts both frontend (port 5173) and backend (port 3001).

## 5. Connect WhatsApp

1. Open http://localhost:5173/login
2. Login with your admin credentials
3. Go to Admin Panel
4. Click "Connect WhatsApp"
5. Scan the QR code with WhatsApp on your phone:
   - Open WhatsApp → Settings → Linked Devices → Link a Device
   - Scan the displayed QR code
6. Wait for connection confirmation

## 6. Start Searching

1. Go to the home page (http://localhost:5173)
2. Wait for messages to be captured from your WhatsApp groups
3. Use the search bar to find watches
4. Click "Contact Seller" to chat with sellers

## Troubleshooting

**QR Code not showing?**
- Wait a few seconds after clicking "Connect WhatsApp"
- Click the "Refresh" button

**Connection failing?**
- Ensure your phone has stable internet
- Try disconnecting and reconnecting
- Make sure WhatsApp Web is not blocked on your network

**No messages appearing?**
- Check connection status is "Connected"
- Messages will only appear after connection is established
- Check backend console for any errors

**Can't login?**
- Verify you created an admin account with `npm run create-admin`
- Check that your email and password are correct
- Ensure backend server is running

## Production Deployment

For production deployment:

1. Change `JWT_SECRET` to a strong random string
2. Use production Supabase database
3. Set up HTTPS
4. Configure CORS for your production domain
5. Use PM2 or similar for backend process management

## Need Help?

Check the full README.md for detailed documentation and troubleshooting.
