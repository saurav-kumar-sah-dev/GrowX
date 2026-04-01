import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Plus, ExternalLink, Edit3, BarChart2, CheckCircle, Sparkles, ArrowRight, Download, Eye, Trash2 } from 'lucide-react';

const chartData = [
  { name: 'Jan', views: 12, downloads: 5 },
  { name: 'Feb', views: 28, downloads: 12 },
  { name: 'Mar', views: 45, downloads: 22 },
  { name: 'Apr', views: 38, downloads: 18 },
  { name: 'May', views: 65, downloads: 32 },
  { name: 'Jun', views: 52, downloads: 28 },
];

const statsData = [
  { name: 'Profile', value: 85 },
  { name: 'Skills', value: 72 },
  { name: 'Experience', value: 90 },
  { name: 'Education', value: 95 },
];

const f = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

export default function ResumePage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const resumes = user?.profile?.resume ? [{ _id: '1', name: user.profile.resumeOriginalName || 'My Resume', url: user.profile.resume, createdAt: user.updatedAt }] : [];
  const total = resumes.length;

  const quickLinks = [
    { label: 'Templates', sub: 'Choose design', route: '/resume-templates', color: '#EC4899', icon: FileText },
    { label: 'ATS Check', sub: 'Score resume', route: '/user/ats', color: '#F59E0B', icon: CheckCircle },
    { label: 'Builder', sub: 'Create new', route: '/resume-builder', color: '#8B5CF6', icon: Edit3 },
  ];

  return (
    <div className="min-h-screen p-5 sm:p-8"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .res-root { font-family: 'DM Sans', sans-serif; }
        .res-card { background: linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
        .res-card:hover { transform: translateY(-2px); border-color: rgba(236,72,153,0.4); }
        @media (max-width: 768px) { .res-grid-links { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="res-root max-w-5xl mx-auto space-y-6">
        <motion.div {...f(0)} className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
          style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(30,41,59,0.95) 100%)', border: '1px solid rgba(236,72,153,0.2)' }}>
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.3),transparent 70%)' }} />
          <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)' }} />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.3)' }}>
                <Sparkles size={12} style={{ color: '#F472B6' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#F472B6', letterSpacing: '0.1em' }}>RESUMES</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Your <span style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Resumes</span>
              </h1>
              <p className="text-white/50 text-sm mt-2 max-w-md">
                Create, manage, and download your professional resumes.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/resume-templates')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #EC4899, #DB2777)', boxShadow: '0 4px 20px rgba(236,72,153,0.4)' }}>
              <Plus size={16} /> Create New
            </motion.button>
          </div>
        </motion.div>

        <motion.div {...f(0.1)} className="res-card rounded-2xl p-6 flex items-center gap-5"
          style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(236,72,153,0.3)' }}>
            <FileText size={28} style={{ color: '#F472B6' }} />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-black text-white">{total}</p>
            <p className="text-sm font-bold" style={{ color: '#F472B6' }}>Resume{total !== 1 ? 's' : ''} Available</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {user?.profile?.resume ? '✓ Uploaded to your profile' : 'Create or upload a resume'}
            </p>
          </div>
        </motion.div>

        <motion.div {...f(0.15)}>
          <h3 className="font-bold text-white text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3 res-grid-links">
            {quickLinks.map((item, i) => (
              <motion.button key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.route)}
                className="res-card rounded-xl p-4 text-left"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.sub}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div {...f(0.2)} className="res-card rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Resume Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#EC4899' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#8B5CF6' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Downloads</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="views" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="downloads" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloads)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...f(0.22)} className="res-card rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="font-bold text-white text-sm mb-4">Resume Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              />
              <Bar dataKey="value" fill="#EC4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        </div>

        <motion.div {...f(0.25)} className="res-card rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="font-bold text-white text-sm">Your Resumes</h3>
          </div>
          <div className="p-3 space-y-2">
            {total === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(236,72,153,0.1)', border: '2px dashed rgba(236,72,153,0.3)' }}>
                  <FileText size={24} style={{ color: 'rgba(236,72,153,0.5)' }} />
                </div>
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>No resumes yet</p>
                <button onClick={() => navigate('/resume-templates')}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #DB2777)' }}>
                  Build Your First Resume
                </button>
              </div>
            ) : resumes.map((r, i) => (
              <motion.div key={r._id || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.25)' }}>
                  <FileText size={16} style={{ color: '#F472B6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{r.name || 'Resume'}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Recently created'}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {r.url && (
                    <>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        className="p2 rounded-lg transition-colors"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>
                        <Eye size={15} />
                      </a>
                      <a href={r.url} download
                        className="p2 rounded-lg transition-colors"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>
                        <Download size={15} />
                      </a>
                    </>
                  )}
                  <button onClick={() => navigate(`/edit-resume/${r._id}`)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <Edit3 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
