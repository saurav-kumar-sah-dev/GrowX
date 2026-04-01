import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => {
  const { allAdminJobs = [], searchJobByText = "" } = useSelector((store) => store.job)
  const [filterJobs, setFilterJobs] = useState(allAdminJobs)
  const navigate = useNavigate()

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      
      const jobTitle = job?.title?.toLowerCase() || "";
      const companyName = job?.company?.name?.toLowerCase() || "";
      const search = searchJobByText.toLowerCase();

      return jobTitle.includes(search) || companyName.includes(search);
    });
    setFilterJobs(filteredJobs)
  }, [allAdminJobs, searchJobByText])

  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-[600px]">
        <TableCaption className="text-[#A8A099]">A list of your recently posted jobs</TableCaption>
        <TableHeader>
          <TableRow className="border-b border-[#252532] hover:bg-[#121218]">
            <TableHead className="text-[#A8A099]">Company Name</TableHead>
            <TableHead className="text-[#A8A099]">Role</TableHead>
            <TableHead className="text-[#A8A099]">Date</TableHead>
            <TableHead className="text-right text-[#A8A099]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.length === 0 ? (
             <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[#A8A099]">
                   No jobs found matching your search.
                </TableCell>
             </TableRow>
          ) : (
            filterJobs?.map((job) => (
              <TableRow key={job._id} className="border-b border-[#252532] hover:bg-[#1A1A24]">
                <TableCell className="text-[#F5F0E6]">{job?.company?.name || "N/A"}</TableCell>
                <TableCell className="text-[#F5F0E6]">{job?.title}</TableCell>
                <TableCell className="text-[#A8A099]">{job?.createdAt?.split('T')[0]}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="cursor-pointer text-[#A8A099] hover:text-[#D4A853]" />
                    </PopoverTrigger>
                    <PopoverContent className="w-32 bg-[#121218] border-[#252532]">
                      <div
                        onClick={() => navigate(`/admin/companies/${job._id}}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer hover:text-[#D4A853] mb-2 text-[#F5F0E6]"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 w-fit cursor-pointer hover:text-[#D4A853] text-[#F5F0E6]"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminJobsTable
