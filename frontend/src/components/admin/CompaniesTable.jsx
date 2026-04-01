import React, { useEffect, useState, useRef } from 'react'
import { Edit2, Trash2, Building2, Calendar, AlertTriangle, Search, Plus, X, Loader2, Check, Upload, Image } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { API } from '@/config/api'

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  accent: "#C8884A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  ivory: "#F5F0E6",
  muted: "#A8A099",
  danger: "#ef4444",
  success: "#10b981",
};

const CompaniesTable = () => {
  const [companies, setCompanies] = useState([])
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', logo: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API.company}/getall`, { withCredentials: true })
      setCompanies(res.data.companies || [])
    } catch (err) {
      console.error('Failed to fetch companies:', err)
      toast.error('Failed to load companies')
    }
  }

  const filteredCompanies = companies.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await axios.delete(`${API.company}/delete/${deleteTarget._id}`, { withCredentials: true })
      setCompanies(prev => prev.filter(c => c._id !== deleteTarget._id))
      toast.success(`"${deleteTarget.name}" deleted successfully`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete company')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const openEditModal = (company) => {
    setEditingCompany(company)
    setEditForm({ name: company.name || '', logo: company.logo || '' })
    setLogoPreview(company.logo || null)
  }

  const closeEditModal = () => {
    setEditingCompany(null)
    setEditForm({ name: '', logo: '' })
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      setLogoPreview(reader.result)
      setEditForm(prev => ({ ...prev, logo: reader.result }))
      toast.success('Logo added successfully')
      setUploading(false)
    }

    reader.onerror = () => {
      toast.error('Failed to read file')
      setUploading(false)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setEditForm(prev => ({ ...prev, logo: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEditSubmit = async () => {
    if (!editForm.name.trim()) {
      return toast.error('Company name is required')
    }

    try {
      setEditLoading(true)
      const res = await axios.put(
        `${API.company}/update/${editingCompany._id}`,
        { companyName: editForm.name.trim(), logo: editForm.logo || undefined },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )

      if (res.data.success) {
        setCompanies(prev => prev.map(c =>
          c._id === editingCompany._id
            ? { ...c, name: editForm.name.trim(), logo: editForm.logo }
            : c
        ))
        toast.success('Company updated successfully')
        closeEditModal()
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update company')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black" style={{ color: C.ivory }}>
              {filteredCompanies.length} Companies
            </h2>
            <p className="text-sm" style={{ color: C.muted }}>Manage your registered companies</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: C.muted }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="h-12 pl-12 pr-4 rounded-2xl border-2 w-64 outline-none transition-all"
                style={{ background: C.obsidian, borderColor: C.goldBorder, color: C.ivory }}
              />
            </div>
            <button
              onClick={() => navigate('/admin/companies/create')}
              className="h-12 px-6 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredCompanies.map((company, index) => (
                <motion.div
                  key={company._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl p-5 border-2 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: C.surface, borderColor: C.goldBorder }}
                >
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="relative">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
                        >
                          <span className="text-white font-black text-2xl">
                            {company.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate" style={{ color: C.ivory }}>
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${C.gold}15` }}>
                          <Calendar className="w-3 h-3" style={{ color: C.gold }} />
                        </div>
                        <span className="text-xs" style={{ color: C.muted }}>
                          {company.createdAt ? new Date(company.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: C.goldBorder }}>
                    <button
                      onClick={() => openEditModal(company)}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                      style={{ background: `${C.gold}15`, color: C.gold, border: `1px solid ${C.goldBorder}` }}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(company)}
                      className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                      style={{ background: 'rgba(239,68,68,0.1)', color: C.danger, border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: `${C.gold}15` }}
            >
              <Building2 className="h-12 w-12" style={{ color: C.gold }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: C.ivory }}>No Companies Found</h3>
            <p className="text-center max-w-sm mb-4" style={{ color: C.muted }}>
              {search ? 'Try adjusting your search term' : 'Get started by creating your first company'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/admin/companies/create')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
              >
                <Plus className="w-5 h-5" />
                Create Company
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="rounded-3xl shadow-2xl p-8 max-w-md w-full"
              style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)' }}
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-xl font-black text-center mb-2" style={{ color: C.ivory }}>Delete Company?</h3>
              <p className="text-center mb-6" style={{ color: C.muted }}>
                Are you sure you want to delete{' '}
                <span className="font-bold" style={{ color: C.ivory }}>"{deleteTarget.name}"</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-12 rounded-2xl border-2 font-bold transition-all"
                  style={{ borderColor: C.goldBorder, color: C.muted }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 h-12 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', opacity: deleting ? 0.5 : 1 }}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={closeEditModal}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="rounded-3xl shadow-2xl p-8 max-w-lg w-full"
              style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black" style={{ color: C.ivory }}>Edit Company</h3>
                <button
                  onClick={closeEditModal}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: C.surface }}
                >
                  <X className="w-5 h-5" style={{ color: C.muted }} />
                </button>
              </div>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: C.ivory }}>
                  Company Logo
                </label>
                <div
                  className="relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center cursor-pointer transition-all"
                  style={{ borderColor: C.goldBorder }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Preview" className="w-24 h-24 rounded-2xl object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      {uploading && (
                        <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${C.gold}15` }}>
                        <Upload className="w-8 h-8" style={{ color: C.gold }} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: C.ivory }}>Click to upload logo</p>
                      <p className="text-xs" style={{ color: C.muted }}>PNG, JPG, WEBP (max 5MB)</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: C.ivory }}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                  className="h-12 rounded-xl border-2"
                  style={{ background: C.obsidian, borderColor: C.goldBorder, color: C.ivory }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeEditModal}
                  className="flex-1 h-12 rounded-2xl border-2 font-bold transition-all"
                  style={{ borderColor: C.goldBorder, color: C.muted }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading}
                  className="flex-1 h-12 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian, opacity: editLoading ? 0.5 : 1 }}
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CompaniesTable
