import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, MessageSquare, ExternalLink, Watch } from 'lucide-react';
import { searchMessages, getGroups, Message } from '../api';

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [sender, setSender] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadGroups();
    handleSearch();
  }, []);

  async function loadGroups() {
    try {
      const { groups: groupList } = await getGroups();
      setGroups(groupList);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  }

  async function handleSearch() {
    setLoading(true);
    try {
      const { messages: results, total: totalCount } = await searchMessages({
        search: searchQuery,
        groupName: selectedGroup,
        sender,
        dateFrom,
        dateTo,
        limit: 50
      });
      setMessages(results);
      setTotal(totalCount);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  function openWhatsApp(waLink: string) {
    window.open(waLink, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Watch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Luxury Watch Finder</h1>
          <p className="text-gray-400">Search through WhatsApp messages to find your perfect timepiece</p>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for watch brand, model, reference..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-900 border-slate-700 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Groups</option>
                  {groups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sender
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Name or number"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 text-gray-400">
          Found {total} message{total !== 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-white">
                      {message.sender_name || message.sender_number}
                    </span>
                    {message.is_group && message.group_name && (
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {message.group_name}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-full">
                      {message.message_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(message.timestamp)}</p>
                </div>
                {message.contacts?.wa_link && (
                  <button
                    onClick={() => openWhatsApp(message.contacts!.wa_link)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact Seller
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>

              {message.content && (
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                </div>
              )}
            </div>
          ))}

          {messages.length === 0 && !loading && (
            <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No messages found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
