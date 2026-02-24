import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AdminPanel } from './components/AdminPanel';
import { SearchInterface } from './components/SearchInterface';
import { Shield, Search } from 'lucide-react';

function Navigation() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
            <Search className="w-6 h-6" />
            WhatsApp Watch Trading
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/search"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/search" element={<SearchInterface />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
