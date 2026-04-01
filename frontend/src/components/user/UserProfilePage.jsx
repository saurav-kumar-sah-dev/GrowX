import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, Phone, FileText, CheckCircle, Edit3, ExternalLink, Shield, MapPin, Calendar, Briefcase, Award } from 'lucide-react';

const f = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

export default function UserProfilePage() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const profileChecks = [
    { label: 'Full Name',     done: !!user?.fullname                   },
    { label: 'Email',         done: !!user?.email                      },
    { label: 'Phone',         done: !!user?.phoneNumber                },
    { label: 'Bio',           done: !!user?.profile?.bio               },
    { label: 'Skills',        done: user?.profile?.skills?.length > 0 },
    { label: 'Resume',        done: !!user?.profile?.resume            },
    { label: 'Profile Photo', done: !!user?.profile?.profilePhoto      },
  ];
  const pct      = Math.round(profileChecks.filter(c => c.done).length / profileChecks.length * 100);
  const initials = user?.fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="min-h-screen p-5 sm:p-8"
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>

      <div className="max-w-6xl mx-auto space-y-6">
        <div {...f(0)} className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2) 0%,rgba(37,99,235,0.2) 50%,rgba(14,165,233,0.2) 100%)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.4),transparent 70%)' }} />
          <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.3),transparent 70%)' }} />
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-5 p-6 sm:p-8">
            <div className="relative shrink-0">
              {user?.profile?.profilePhoto
                ? <img src={user.profile.profilePhoto} alt="avatar"
                    className="w-24 h-24 rounded-2xl object-cover"
                    style={{ boxShadow: '0 0 0 4px rgba(255,255,255,0.1),0 8px 32px rgba(0,0,0,0.5)' }} />
                : <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-3xl text-white"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 0 4px rgba(255,255,255,0.1),0 8px 32px rgba(124,58,237,0.4)' }}>
                    {initials}
                  </div>
              }
              {user?.isEmailVerified && (
                <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  style={{ boxShadow: '0 0 0 3px #0f172a' }}>
                  <Shield size={14} className="text-white" />
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <Award size={12} style={{ color: '#a78bfa' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.1em' }}>PROFILE</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.fullname || 'Your Name'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
                  style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                  {user?.role}
                </span>
                {user?.isEmailVerified && (
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                    <Shield size={11} /> Verified Account
                  </span>
                )}
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                  {pct}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div {...f(0.1)} className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-bold text-white text-sm mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: UserCircle, label: 'Full Name', value: user?.fullname, color: '#a78bfa' },
                { icon: Mail, label: 'Email Address', value: user?.email, color: '#60a5fa' },
                { icon: Phone, label: 'Phone Number', value: user?.phoneNumber, color: '#34d399' },
                { icon: MapPin, label: 'Location', value: user?.profile?.location, color: '#f59e0b' },
                { icon: Briefcase, label: 'Role', value: user?.role, color: '#f472b6' },
                { icon: Calendar, label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null, color: '#38bdf8' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl"
                  style={{ background: `${item.color}10`, border: `1px solid ${item.color}25` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${item.color}20` }}>
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</p>
                  </div>
                  <p className="text-sm font-bold text-white capitalize">
                    {item.value || <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>Not set</span>}
                  </p>
                </div>
              ))}
            </div>

            {user?.profile?.bio && (
              <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#a78bfa' }}>Bio</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{user.profile.bio}</p>
              </div>
            )}
          </motion.div>

          <motion.div {...f(0.15)} className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Profile Strength</h3>
              <span className="text-lg font-black" style={{ color: '#a78bfa' }}>{pct}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#7c3aed,#2563eb)', boxShadow: '0 0 15px rgba(124,58,237,0.5)' }} />
            </div>
            <div className="space-y-3">
              {profileChecks.map(c => (
                <div key={c.label} className="flex items-center gap-3 group">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${c.done ? 'bg-emerald-500' : 'bg-white/10'}`}>
                    {c.done ? <CheckCircle size={11} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-white/30" />}
                  </div>
                  <span className={`text-xs font-medium flex-1 ${c.done ? 'text-white/70' : 'text-white/35'}`}>{c.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {user?.profile?.skills?.length > 0 && (
          <motion.div {...f(0.2)} className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-bold text-white text-sm mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.map((skill, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.02 * i }}
                  className="px-4 py-2 text-xs font-bold rounded-xl"
                  style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {user?.profile?.resume && (
          <motion.div {...f(0.25)} className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-bold text-white text-sm mb-4">Resume</h3>
            <a href={user.profile.resume} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl transition-all group cursor-pointer"
              style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(5,150,105,0.2)', border: '1px solid rgba(5,150,105,0.3)' }}>
                <FileText size={20} style={{ color: '#34d399' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.profile.resumeOriginalName || 'My Resume'}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: '#34d399' }}>Click to view resume</p>
              </div>
              <ExternalLink size={18} style={{ color: '#34d399' }} />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
