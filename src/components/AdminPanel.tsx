import React, { useState, useEffect } from 'react';
import { QrCode, Power, PowerOff, RefreshCw, Phone } from 'lucide-react';
import { connectWhatsApp, disconnectWhatsApp, getQRCode, getWhatsAppStatus } from '../api';

export function AdminPanel() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'connecting') {
      console.log('Status is connecting, starting QR code polling...');
      const interval = setInterval(async () => {
        try {
          const result = await getQRCode();
          console.log('QR code result:', result);
          setQrCode(result.qrCode);
        } catch (error) {
          console.error('Failed to get QR code:', error);
        }
      }, 2000);
      return () => clearInterval(interval);
    } else {
      console.log('Status changed to:', status);
    }
  }, [status]);

  async function loadStatus() {
    try {
      const statusData = await getWhatsAppStatus();
      setStatus(statusData.status);
      setPhoneNumber(statusData.phoneNumber);
      if (statusData.status === 'connected') {
        setQrCode(null);
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  }

  async function handleConnect() {
    setLoading(true);
    try {
      console.log('Connecting to WhatsApp...');
      await connectWhatsApp();
      console.log('Connect request sent, loading status...');
      await loadStatus();
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await disconnectWhatsApp();
      setQrCode(null);
      await loadStatus();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">WhatsApp Watch Trading Admin</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              WhatsApp Connection
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold ${
                    status === 'connected' ? 'text-green-400' :
                    status === 'connecting' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                {phoneNumber && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white font-mono">+{phoneNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {status === 'disconnected' && (
                  <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Power className="w-4 h-4" />
                    Connect WhatsApp
                  </button>
                )}

                {status === 'connected' && (
                  <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <PowerOff className="w-4 h-4" />
                    Disconnect
                  </button>
                )}

                {status === 'connecting' && (
                  <button
                    onClick={loadStatus}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Scanner
            </h2>

            {qrCode ? (
              <div className="bg-white rounded-lg p-4">
                <img src={qrCode} alt="WhatsApp QR Code" className="w-full" />
                <p className="text-center text-sm text-gray-600 mt-3">
                  Scan this code with WhatsApp on your phone
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <p className="text-gray-400 text-center">
                  {status === 'connected'
                    ? 'WhatsApp is connected'
                    : 'Click "Connect WhatsApp" to generate QR code'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Click "Connect WhatsApp" to generate a QR code</li>
            <li>Open WhatsApp on your phone</li>
            <li>Go to Settings → Linked Devices → Link a Device</li>
            <li>Scan the QR code shown above</li>
            <li>Wait for the connection to be established</li>
            <li>Once connected, all messages from your groups will be automatically stored</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
