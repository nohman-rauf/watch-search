import { Link } from 'react-router-dom';
import { Search, Shield, MessageSquare, Clock } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Luxury Watch Trading Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Search and discover luxury watches from WhatsApp groups
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/search"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-6 h-6" />
              Start Searching
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 bg-slate-700 text-white rounded-lg font-semibold text-lg hover:bg-slate-600 transition-colors"
            >
              <Shield className="w-6 h-6" />
              Admin Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Search</h3>
            <p className="text-gray-400">
              Search through messages by watch model, brand, seller, or group name with advanced filters
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">WhatsApp Integration</h3>
            <p className="text-gray-400">
              Automatically capture and index messages from WhatsApp trading groups in real-time
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Time Travel</h3>
            <p className="text-gray-400">
              Filter messages by date range to find watches listed at specific times
            </p>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Admin Setup</h4>
                <p className="text-gray-400">Admin connects their WhatsApp account and joins trading groups</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Auto-Capture</h4>
                <p className="text-gray-400">Messages are automatically captured and stored in the database</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Search & Discover</h4>
                <p className="text-gray-400">Users can search through all messages to find watches they're interested in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
