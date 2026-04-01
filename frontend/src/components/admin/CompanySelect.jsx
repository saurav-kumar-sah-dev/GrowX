import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Search, Plus, Check, X, Loader2, Image,
  Briefcase, MapPin, Users, Globe, ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  accent: "#C8884A",
  ivory: "#F5F0E6",
  muted: "#A8A099",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
};

const CompanySelect = ({
  value,
  onChange,
  placeholder = "Select a company",
  error = null,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const ref = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchCompanies(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const fetchCompanies = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get(`${API.company}/getall`, {
        withCredentials: true,
        params: {
          page: reset ? 1 : page,
          limit: ITEMS_PER_PAGE,
          search: search || ''
        }
      });

      const data = res.data.companies || res.data || [];
      
      if (reset) {
        setCompanies(data);
        setPage(1);
      } else {
        setCompanies(prev => [...prev, ...data]);
      }

      setHasMore(data.length >= ITEMS_PER_PAGE);
      if (!reset) setPage(prev => prev + 1);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchCompanies(true);
  };

  const handleSelect = (company) => {
    setSelectedCompany(company);
    onChange(company._id);
    setOpen(false);
    setSearch('');
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100;
    if (bottom && hasMore && !loadingMore && !loading) {
      setPage(prev => prev + 1);
      fetchCompanies(false);
    }
  };

  const filteredCompanies = search
    ? companies.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.industry?.toLowerCase().includes(search.toLowerCase())
      )
    : companies;

  const Logo = ({ src, name, size = 48 }) => (
    src ? (
      <img
        src={src}
        alt={name}
        className="rounded-xl object-cover shadow-lg border-2"
        style={{ width: size, height: size, borderColor: C.goldBorder }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : null
  );

  const FallbackLogo = ({ name, size = 48 }) => (
    <div
      className="rounded-xl items-center justify-center shadow-lg"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`
      }}
    >
      <span className="text-white font-black text-lg">{name?.charAt(0)?.toUpperCase() || 'C'}</span>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full h-16 px-5 rounded-2xl flex items-center gap-4 transition-all duration-200 border-2 ${
          error
            ? 'border-red-500/50'
            : selectedCompany || value
              ? 'border-[#D4A853]'
              : 'border-[#252532] hover:border-[#D4A853]/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{ background: '#0A0A0F' }}
      >
        {selectedCompany || value ? (
          <>
            {selectedCompany?.logo ? (
              <img
                src={selectedCompany.logo}
                alt={selectedCompany.name}
                className="w-12 h-12 rounded-xl object-cover shadow-lg border-2"
                style={{ borderColor: C.goldBorder }}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
              >
                <span className="text-white font-black text-lg">
                  {selectedCompany?.name?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="font-bold text-[#F5F0E6]">{selectedCompany?.name || 'Selected Company'}</p>
              {selectedCompany?.industry && (
                <p className="text-xs" style={{ color: C.muted }}>{selectedCompany.industry}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${C.gold}20` }}
            >
              <Building2 className="w-6 h-6" style={{ color: C.gold }} />
            </div>
            <span className="flex-1 text-left font-semibold" style={{ color: '#A8A099' }}>
              {placeholder}
            </span>
          </>
        )}
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: C.muted }}
        />
      </button>

      {error && (
        <p className="text-red-500 text-xs mt-2 px-1">{error}</p>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-full mt-3 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: '#1A1A24',
              border: `1px solid ${C.goldBorder}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5)`
            }}
          >
            {/* Header with Search */}
            <div className="sticky top-0 z-10 p-4 border-b" style={{ background: '#1A1A24', borderColor: C.goldBorder }}>
              <div className="relative mb-3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: C.muted }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search companies by name or industry..."
                  className="w-full h-14 pl-14 pr-12 rounded-2xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099] border-2 border-[#252532] focus:border-[#D4A853] outline-none transition-all text-base"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#252532] transition-colors"
                  >
                    <X className="w-5 h-5" style={{ color: C.muted }} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: C.muted }}>
                  {loading ? 'Loading...' : `${filteredCompanies.length} companies found`}
                </p>
                <button
                  onClick={() => { setOpen(false); navigate('/admin/companies/create'); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
            </div>

            {/* Company List */}
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="max-h-[400px] overflow-y-auto custom-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 rounded-full border-4 border-transparent animate-spin" style={{ borderBottomColor: C.gold }} />
                  <p className="mt-4 text-sm" style={{ color: C.muted }}>Loading companies...</p>
                </div>
              ) : filteredCompanies.length > 0 ? (
                <>
                  {filteredCompanies.map((company, index) => (
                    <button
                      key={company._id}
                      type="button"
                      onClick={() => handleSelect(company)}
                      className={`w-full px-5 py-4 flex items-center gap-4 hover:bg-[#252532] transition-all border-b ${
                        value === company._id ? 'bg-[#252532]' : ''
                      } ${index === filteredCompanies.length - 1 ? 'border-b-0' : ''}`}
                      style={{ borderColor: `${C.goldBorder}50` }}
                    >
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2"
                          style={{ borderColor: 'transparent' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
                        >
                          <span className="text-white font-black text-xl">{company.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="font-bold text-[#F5F0E6] text-base">{company.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {company.industry && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                              <Briefcase className="w-3 h-3" />
                              {company.industry}
                            </span>
                          )}
                          {company.location && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                              <MapPin className="w-3 h-3" />
                              {company.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {value === company._id && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: C.gold }}
                        >
                          <Check className="w-5 h-5" style={{ color: C.obsidian }} />
                        </div>
                      )}
                    </button>
                  ))}

                  {loadingMore && (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-6 h-6 rounded-full border-2 border-transparent animate-spin" style={{ borderBottomColor: C.gold }} />
                    </div>
                  )}

                  {!hasMore && filteredCompanies.length > 5 && (
                    <div className="text-center py-4 border-t" style={{ borderColor: C.goldBorder }}>
                      <p className="text-sm" style={{ color: C.muted }}>All companies loaded</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
                    style={{ background: `${C.gold}15` }}
                  >
                    <Building2 className="w-10 h-10" style={{ color: C.gold }} />
                  </div>
                  <p className="font-bold text-[#F5F0E6] text-lg">No companies found</p>
                  <p className="text-sm mt-1 mb-4" style={{ color: C.muted }}>
                    {search ? 'Try a different search term' : 'Add your first company to get started'}
                  </p>
                  {!search && (
                    <button
                      onClick={() => { setOpen(false); navigate('/admin/companies/create'); }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
                    >
                      <Plus className="w-5 h-5" />
                      Create Company
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanySelect;
