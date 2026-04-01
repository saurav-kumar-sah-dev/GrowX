import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Bot, User, Clock, MessageCircle, Trash2, ChevronDown, ChevronUp, Eye, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_AI_CHAT_API || 'http://localhost:5000/api/v1/ai-chat';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
};

const AdminAIChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChat, setExpandedChat] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const getUserDisplay = (chat) => {
    if (chat.userId) {
      const userName = chat.userName || chat.userId?.fullname || '';
      const userEmail = chat.userEmail || chat.userId?.email || '';
      return {
        name: userName || userEmail?.split('@')[0] || 'User',
        email: userEmail,
        isGuest: false
      };
    }
    return {
      name: 'Guest User',
      email: chat.userEmail || null,
      isGuest: true
    };
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/all?page=${page}&limit=15`, {
        withCredentials: true
      });
      console.log('Chats API Response:', res.data);
      console.log('First chat data:', res.data?.data?.[0]);
      setChats(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      setChats([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`, {
        withCredentials: true
      });
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchStats();
  }, [page]);

  const deleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      await axios.delete(`${API_URL}/${chatId}`, {
        withCredentials: true
      });
      setChats(chats.filter(c => c._id !== chatId));
      fetchStats();
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
    <div className="min-h-screen p-4 md:p-6" style={{ background: C.obsidian }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: C.gold }}>
            AI Chat History
          </h1>
          <p className="text-sm" style={{ color: C.ivoryMuted }}>
            View and manage AI assistant conversations
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.ivoryMuted }}>Total Chats</p>
              <p className="text-2xl font-bold" style={{ color: C.gold }}>{stats.totalChats}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.ivoryMuted }}>Registered Users</p>
              <p className="text-2xl font-bold" style={{ color: C.goldLight }}>{stats.userChats}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.ivoryMuted }}>Guest Users</p>
              <p className="text-2xl font-bold" style={{ color: C.goldDark }}>{stats.guestChats}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.ivoryMuted }}>Topics</p>
              <p className="text-2xl font-bold" style={{ color: C.gold }}>{stats.topicStats?.length || 0}</p>
            </motion.div>
          </div>
        )}

        {/* Topic Distribution */}
        {stats?.topicStats?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: C.gold }}>Topic Distribution</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topicStats.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                >
                  {topic._id}: {topic.count}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat List */}
        <div className="rounded-xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
          <div className="p-4 border-b" style={{ borderColor: C.goldBorder }}>
            <h3 className="text-sm font-semibold" style={{ color: C.gold }}>
              Recent Conversations ({pagination.total || 0})
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${C.gold}`, borderTopColor: 'transparent' }} />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: C.ivoryMuted }} />
              <p style={{ color: C.ivoryMuted }}>No chat history found</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.goldBorder }}>
              {chats.map((chat, index) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4"
                >
                  {/* Chat Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)` }}>
                        <Bot className="w-5 h-5 text-gray-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold" style={{ color: C.ivory }}>
                            {chat.isGuest ? '👤 Guest User' : `👤 ${getUserDisplay(chat).name}`}
                          </p>
                          {chat.userId ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium"
                              style={{ background: '#10B98133', color: '#10B981' }}>
                              ✓ Logged In
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium"
                              style={{ background: C.goldDim, color: C.gold }}>
                              Guest
                            </span>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: C.ivoryMuted }}>
                          📧 {getUserDisplay(chat).email || 'Anonymous User'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: C.goldDim, color: C.gold }}>
                        {chat.topic}
                      </span>
                      <button
                        onClick={() => setExpandedChat(expandedChat === chat._id ? null : chat._id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: C.ivoryMuted }}
                        onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {expandedChat === chat._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteChat(chat._id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#EF4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chat Meta */}
                  <div className="flex items-center gap-4 text-xs mb-2" style={{ color: C.ivoryMuted }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(chat.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {chat.messages?.length || 0} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Session: {chat.sessionId?.slice(0, 15)}...
                    </span>
                  </div>

                  {/* Expanded Messages */}
                  {expandedChat === chat._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 p-3 rounded-lg max-h-80 overflow-y-auto"
                      style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
                    >
                      {chat.messages?.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3 last:mb-0`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="w-6 h-6 rounded mr-2 flex items-center justify-center shrink-0"
                              style={{ background: C.gold }}>
                              <Bot className="w-3 h-3 text-gray-900" />
                            </div>
                          )}
                          <div
                            className="max-w-[80%] px-3 py-2 rounded-lg text-xs"
                            style={{
                              background: msg.role === 'user' ? C.gold : C.surfaceLight,
                              color: msg.role === 'user' ? C.obsidian : C.ivory,
                            }}
                          >
                            {msg.content}
                          </div>
                          {msg.role === 'user' && (
                            <div className="w-6 h-6 rounded ml-2 flex items-center justify-center shrink-0"
                              style={{ background: C.surfaceLight }}>
                              <User className="w-3 h-3" style={{ color: C.ivoryMuted }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: C.goldBorder }}>
              <p className="text-xs" style={{ color: C.ivoryMuted }}>
                Page {pagination.page || 1} of {pagination.pages || 1}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  style={{ background: C.goldDim, color: C.gold }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= (pagination.pages || 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  style={{ background: C.goldDim, color: C.gold }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminAIChatHistory;
