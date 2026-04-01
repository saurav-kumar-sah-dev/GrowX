import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, Search, BarChart2, TrendingUp, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { API } from '@/config/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  surfaceLight: "#1C1F28",
  card: "#1A1D26",
  cardHover: "#22252F",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
}

const COLORS = ['#D4A853', '#10b981', '#C8884A', '#ef4444', '#E8C17A', '#06b6d4', '#C8884A']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl shadow-2xl p-4 min-w-[130px]" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
        {label && <p className="font-bold text-sm mb-2" style={{ color: C.white }}>{label}</p>}
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs" style={{ color: C.muted }}>{p.name}:</span>
            <span className="text-xs font-bold" style={{ color: C.white }}>{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const Companies = () => {
  const [input, setInput] = useState('')
  const [companies, setCompanies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API.company}/all`, {
          credentials: 'include'
        });
        const data = await res.json();
        setCompanies(data.companies || []);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c =>
    !input ||
    c.name?.toLowerCase().includes(input.toLowerCase()) ||
    c.location?.toLowerCase().includes(input.toLowerCase())
  );

  const monthlyData = (() => {
    const map = {}
    companies?.forEach(c => {
      if (c.createdAt) {
        const m = new Date(c.createdAt).toLocaleString('default', { month: 'short' })
        map[m] = (map[m] || 0) + 1
      }
    })
    return Object.entries(map).map(([month, count]) => ({ month, count }))
  })()

  const locationData = (() => {
    const map = {}
    companies?.forEach(c => {
      const loc = c.location || 'Unknown'
      map[loc] = (map[loc] || 0) + 1
    })
    return Object.entries(map).slice(0, 6).map(([name, value]) => ({ name, value }))
  })()

  const topCompanies = [...(companies || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map(c => ({
      name: c.name?.length > 12 ? c.name.slice(0, 12) + '..' : (c.name || 'N/A'),
      jobs: c.jobs?.length || 0,
    }))

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <Building2 className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Companies</h1>
                  <p className="text-white/80">Manage your registered companies & analytics</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{companies?.length || 0} Total</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{monthlyData.length} Active Months</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate('/admin/companies/create')}
                  className="shadow-xl h-12 px-6 rounded-2xl font-bold"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                  <Plus className="h-5 w-5 mr-2" /> New Company
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: C.goldDim }}>
              <BarChart2 className="w-4 h-4" style={{ color: C.gold }} />
            </div>
            <div>
              <h2 className="text-xl font-black" style={{ color: C.white }}>Company Analytics</h2>
              <p className="text-xs" style={{ color: C.muted }}>Visual overview of company registrations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                <CardHeader className="px-6 py-4 border-b" style={{ background: C.surface, borderColor: C.goldBorder }}>
                  <CardTitle className="flex items-center gap-2 text-base" style={{ color: C.white }}>
                    <TrendingUp className="w-5 h-5" style={{ color: C.gold }} />
                    Monthly Company Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="companyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4A853" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke={C.gold} strokeWidth={3}
                        fill="url(#companyAreaGrad)"
                        dot={{ fill: C.gold, r: 5, strokeWidth: 2, stroke: C.card }}
                        activeDot={{ r: 8 }} name="Companies" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden h-full" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                <CardHeader className="px-6 py-4 border-b" style={{ background: C.surface, borderColor: C.goldBorder }}>
                  <CardTitle className="flex items-center gap-2 text-base" style={{ color: C.white }}>
                    <Building2 className="w-5 h-5" style={{ color: C.gold }} />
                    Location Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={locationData} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                        dataKey="value" paddingAngle={4}>
                        {locationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-1.5 w-full mt-2">
                    {locationData.map((l, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor: `${COLORS[i % COLORS.length]}15` }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-xs font-semibold truncate max-w-[100px]" style={{ color: C.white }}>{l.name}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color: COLORS[i % COLORS.length] }}>{l.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {topCompanies.some(c => c.jobs > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                <CardHeader className="px-6 py-4 border-b" style={{ background: C.surface, borderColor: C.goldBorder }}>
                  <CardTitle className="flex items-center gap-2 text-base" style={{ color: C.white }}>
                    <BarChart2 className="w-5 h-5" style={{ color: C.gold }} />
                    Company Analytics Graph — Jobs per Company
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topCompanies}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="jobs" radius={[8, 8, 0, 0]} name="Jobs" maxBarSize={44}>
                        {topCompanies.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl shadow-lg border p-4 sm:p-5 mb-6" style={{ background: C.card, borderColor: C.goldBorder }}>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
            <Input
              className="pl-12 h-12 border-2 rounded-2xl shadow-sm text-base"
              style={{ background: C.obsidian, borderColor: C.goldBorder, color: C.white }}
              placeholder="Search companies by name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl shadow-xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
          <CompaniesTable />
        </motion.div>

      </div>
    </AdminLayout>
  )
}

export default Companies
