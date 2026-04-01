import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Plus, Search } from 'lucide-react'
import AdminLayout from './AdminLayout'
import axios from 'axios'
import { API } from '@/config/api'

const AdminJobs = () => {
  const [input, setInput] = useState("")
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API.job}/getadminjobs`, { withCredentials: true });
        setJobs(res.data?.jobs || []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    !input || 
    job.title?.toLowerCase().includes(input.toLowerCase()) ||
    job.location?.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#C8884A] flex items-center justify-center shadow-lg">
              <Briefcase className="h-6 w-6 text-[#0A0A0F]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#F5F0E6]">Job Postings</h1>
              <p className="text-sm text-[#A8A099]">Manage all your job listings ({jobs.length})</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A099]" />
            <Input
              className="pl-10 h-11 bg-[#121218] border-2 border-[#252532] focus:border-[#D4A853] rounded-xl shadow-sm text-[#F5F0E6] placeholder:text-[#A8A099]"
              placeholder="Search by title, role..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="w-full sm:w-auto h-11 bg-gradient-to-r from-[#D4A853] to-[#C8884A] hover:from-[#C8884A] hover:to-[#D4A853] rounded-xl shadow-lg font-semibold text-[#0A0A0F]"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>

        <div className="bg-[#121218] rounded-2xl shadow-xl border border-[#252532] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#A8A099]">Loading...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-8 text-center text-[#A8A099]">
              {jobs.length === 0 ? 'No jobs found' : 'No matching jobs'}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#1A1D26]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#A8A099] uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#A8A099] uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#A8A099] uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#A8A099] uppercase">Applicants</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#A8A099] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="border-t border-[#252532] hover:bg-[#1A1D26]">
                    <td className="px-4 py-3 text-[#F5F0E6]">{job.title}</td>
                    <td className="px-4 py-3 text-[#A8A099]">{job.location}</td>
                    <td className="px-4 py-3 text-[#A8A099]">{job.jobType}</td>
                    <td className="px-4 py-3 text-[#A8A099]">{job.applications?.length || 0}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" onClick={() => navigate(`/admin/jobs/${job._id}`)} className="bg-[#D4A853] text-[#0A0A0F]">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminJobs
