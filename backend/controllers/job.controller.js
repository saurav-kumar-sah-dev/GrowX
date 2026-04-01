import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// CREATE JOB
// ─────────────────────────────────────────────────────────────────────────────
export const postJob = async (req, res) => {
    try {
        const {
            title, description, requirements, skills, salary, salaryMin, salaryMax,
            experienceLevel, experienceYears, location, city, state, jobType, workMode,
            position, positionsOpen, companyId, benefits, responsibilities, qualifications,
            applicationDeadline, urgent, featured, stipendAmount, stipendType, duration, whoCanApply
        } = req.body;
        const userId = req.id;

        if (!title || !description || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                message: "Please provide all required fields.",
                success: false
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements?.split(",").map(r => r.trim()).filter(Boolean) || [],
            skills: Array.isArray(skills) ? skills : skills?.split(",").map(s => s.trim()).filter(Boolean) || [],
            salary,
            salaryMin: Number(salaryMin) || 0,
            salaryMax: Number(salaryMax) || 0,
            experienceLevel,
            experienceYears: Number(experienceYears) || 0,
            location,
            city: city || location,
            state: state || "",
            jobType,
            workMode: workMode || "On-site",
            position: Number(position),
            positionsOpen: Number(positionsOpen) || Number(position),
            company: companyId,
            created_by: userId,
            benefits: Array.isArray(benefits) ? benefits : [],
            responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
            qualifications: Array.isArray(qualifications) ? qualifications : [],
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
            urgent: urgent || false,
            featured: featured || false,
            stipendAmount: Number(stipendAmount) || 0,
            stipendType: stipendType || "Negotiable",
            duration: Number(duration) || 3,
            whoCanApply: whoCanApply || null
        });

        const populatedJob = await Job.findById(job._id).populate({
            path: "company",
            select: "name logo location"
        });

        return res.status(201).json({
            message: "Job created successfully.",
            job: populatedJob,
            success: true
        });
    } catch (error) {
        console.error('postJob error:', error);
        return res.status(500).json({
            message: 'Internal server error while creating job.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL JOBS (for students/users)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllJobs = async (req, res) => {
    try {
        const { keyword, jobType, workMode, experience, location, status, page = 1, limit = 20 } = req.query;
        
        const query = { isDeleted: false };
        
        if (status) {
            query.status = status;
        } else {
            query.status = "active";
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { skills: { $regex: keyword, $options: "i" } },
            ];
        }

        if (jobType) query.jobType = jobType;
        if (workMode) query.workMode = workMode;
        if (experience) query.experienceLevel = experience;
        if (location) query.location = { $regex: location, $options: "i" };

        const skip = (Number(page) - 1) * Number(limit);
        
        const jobs = await Job.find(query)
            .populate({
                path: "company",
                select: "name logo location website"
            })
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Job.countDocuments(query);

        return res.status(200).json({
            jobs,
            success: true,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error('getAllJobs error:', error);
        return res.status(500).json({
            message: 'Error fetching jobs.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET JOB BY ID
// ─────────────────────────────────────────────────────────────────────────────
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        const job = await Job.findById(jobId)
            .populate({
                path: "company",
                select: "name logo location website description industry"
            })
            .populate({
                path: "applications",
                select: "status createdAt"
            });

        if (!job || job.isDeleted) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Increment view count
        job.views += 1;
        await job.save();

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error('getJobById error:', error);
        return res.status(500).json({
            message: 'Error fetching job.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ADMIN JOBS
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminJobs = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const adminId = req.id;

        const query = { created_by: adminId, isDeleted: false };
        if (status) query.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await Job.find(query)
            .populate({
                path: "company",
                select: "name logo location"
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Job.countDocuments(query);

        // Get stats
        const stats = await Job.aggregate([
            { $match: { created_by: adminId, isDeleted: false } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusCounts = {
            active: 0,
            closed: 0,
            paused: 0,
            draft: 0,
            total: total
        };

        stats.forEach(s => {
            statusCounts[s._id] = s.count;
        });

        return res.status(200).json({
            jobs,
            success: true,
            stats: statusCounts,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error('getAdminJobs error:', error);
        return res.status(500).json({
            message: 'Error fetching admin jobs.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE JOB
// ─────────────────────────────────────────────────────────────────────────────
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const job = await Job.findOne({ _id: jobId, created_by: adminId, isDeleted: false });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you don't have permission to update.",
                success: false
            });
        }

        const {
            title, description, requirements, skills, salary, salaryMin, salaryMax,
            experienceLevel, experienceYears, location, city, state, jobType, workMode,
            position, positionsOpen, status, benefits, responsibilities, qualifications,
            applicationDeadline, urgent, featured, stipendAmount, stipendType, duration, whoCanApply
        } = req.body;

        // Update fields if provided
        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) job.requirements = Array.isArray(requirements) ? requirements : requirements.split(",").map(r => r.trim()).filter(Boolean);
        if (skills) job.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim()).filter(Boolean);
        if (salary) job.salary = salary;
        if (salaryMin !== undefined) job.salaryMin = Number(salaryMin);
        if (salaryMax !== undefined) job.salaryMax = Number(salaryMax);
        if (experienceLevel) job.experienceLevel = experienceLevel;
        if (experienceYears !== undefined) job.experienceYears = Number(experienceYears);
        if (location) job.location = location;
        if (city) job.city = city;
        if (state) job.state = state;
        if (jobType) job.jobType = jobType;
        if (workMode) job.workMode = workMode;
        if (position) job.position = Number(position);
        if (positionsOpen !== undefined) job.positionsOpen = Number(positionsOpen);
        if (status) job.status = status;
        if (benefits) job.benefits = Array.isArray(benefits) ? benefits : [];
        if (responsibilities) job.responsibilities = Array.isArray(responsibilities) ? responsibilities : [];
        if (qualifications) job.qualifications = Array.isArray(qualifications) ? qualifications : [];
        if (applicationDeadline !== undefined) job.applicationDeadline = applicationDeadline ? new Date(applicationDeadline) : null;
        if (urgent !== undefined) job.urgent = urgent;
        if (featured !== undefined) job.featured = featured;
        if (stipendAmount !== undefined) job.stipendAmount = Number(stipendAmount);
        if (stipendType !== undefined) job.stipendType = stipendType;
        if (duration !== undefined) job.duration = Number(duration);
        if (whoCanApply !== undefined) job.whoCanApply = whoCanApply;

        await job.save();

        const updatedJob = await Job.findById(job._id).populate({
            path: "company",
            select: "name logo location"
        });

        return res.status(200).json({
            message: "Job updated successfully.",
            job: updatedJob,
            success: true
        });
    } catch (error) {
        console.error('updateJob error:', error);
        return res.status(500).json({
            message: 'Error updating job.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE JOB (Soft Delete)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const job = await Job.findOne({ _id: jobId, created_by: adminId });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you don't have permission to delete.",
                success: false
            });
        }

        // Soft delete
        job.isDeleted = true;
        job.status = "closed";
        await job.save();

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error('deleteJob error:', error);
        return res.status(500).json({
            message: 'Error deleting job.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RESTORE JOB
// ─────────────────────────────────────────────────────────────────────────────
export const restoreJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const job = await Job.findOne({ _id: jobId, created_by: adminId });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        job.isDeleted = false;
        job.status = "active";
        await job.save();

        return res.status(200).json({
            message: "Job restored successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error('restoreJob error:', error);
        return res.status(500).json({
            message: 'Error restoring job.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET DELETED JOBS
// ─────────────────────────────────────────────────────────────────────────────
export const getDeletedJobs = async (req, res) => {
    try {
        const adminId = req.id;

        const jobs = await Job.find({ created_by: adminId, isDeleted: true })
            .populate({
                path: "company",
                select: "name logo location"
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error('getDeletedJobs error:', error);
        return res.status(500).json({
            message: 'Error fetching deleted jobs.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// BULK UPDATE STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const bulkUpdateStatus = async (req, res) => {
    try {
        const { jobIds, status } = req.body;
        const adminId = req.id;

        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
            return res.status(400).json({
                message: "Please provide job IDs.",
                success: false
            });
        }

        if (!["active", "closed", "paused", "draft"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status.",
                success: false
            });
        }

        await Job.updateMany(
            { _id: { $in: jobIds }, created_by: adminId },
            { status }
        );

        return res.status(200).json({
            message: `${jobIds.length} jobs updated to "${status}".`,
            success: true
        });
    } catch (error) {
        console.error('bulkUpdateStatus error:', error);
        return res.status(500).json({
            message: 'Error updating jobs.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE FEATURED
// ─────────────────────────────────────────────────────────────────────────────
export const toggleFeatured = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const job = await Job.findOne({ _id: jobId, created_by: adminId });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        job.featured = !job.featured;
        await job.save();

        return res.status(200).json({
            message: `Job ${job.featured ? 'featured' : 'unfeatured'} successfully.`,
            job,
            success: true
        });
    } catch (error) {
        console.error('toggleFeatured error:', error);
        return res.status(500).json({
            message: 'Error toggling featured.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE URGENT
// ─────────────────────────────────────────────────────────────────────────────
export const toggleUrgent = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const job = await Job.findOne({ _id: jobId, created_by: adminId });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        job.urgent = !job.urgent;
        await job.save();

        return res.status(200).json({
            message: `Job marked as ${job.urgent ? 'urgent' : 'not urgent'}.`,
            job,
            success: true
        });
    } catch (error) {
        console.error('toggleUrgent error:', error);
        return res.status(500).json({
            message: 'Error toggling urgent.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DUPLICATE JOB
// ─────────────────────────────────────────────────────────────────────────────
export const duplicateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const originalJob = await Job.findOne({ _id: jobId, created_by: adminId });

        if (!originalJob) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        const duplicatedJob = await Job.create({
            ...originalJob.toObject(),
            _id: undefined,
            title: `${originalJob.title} (Copy)`,
            status: "draft",
            applications: [],
            applicationCount: 0,
            views: 0,
            createdAt: undefined,
            updatedAt: undefined
        });

        const populated = await Job.findById(duplicatedJob._id).populate({
            path: "company",
            select: "name logo location"
        });

        return res.status(201).json({
            message: "Job duplicated successfully.",
            job: populated,
            success: true
        });
    } catch (error) {
        console.error('duplicateJob error:', error);
        return res.status(500).json({
            message: 'Error duplicating job.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// JOB STATISTICS
// ─────────────────────────────────────────────────────────────────────────────
export const getJobStats = async (req, res) => {
    try {
        const adminId = req.id;

        const stats = await Job.aggregate([
            { $match: { created_by: adminId, isDeleted: false } },
            {
                $group: {
                    _id: null,
                    totalJobs: { $sum: 1 },
                    activeJobs: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                    closedJobs: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
                    pausedJobs: { $sum: { $cond: [{ $eq: ["$status", "paused"] }, 1, 0] } },
                    draftJobs: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
                    totalViews: { $sum: "$views" },
                    totalApplications: { $sum: "$applicationCount" },
                    urgentJobs: { $sum: { $cond: ["$urgent", 1, 0] } },
                    featuredJobs: { $sum: { $cond: ["$featured", 1, 0] } }
                }
            }
        ]);

        const monthlyStats = await Job.aggregate([
            { 
                $match: { 
                    created_by: adminId, 
                    isDeleted: false,
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const jobTypeStats = await Job.aggregate([
            { $match: { created_by: adminId, isDeleted: false } },
            { $group: { _id: "$jobType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return res.status(200).json({
            success: true,
            stats: stats[0] || {
                totalJobs: 0, activeJobs: 0, closedJobs: 0, pausedJobs: 0, 
                draftJobs: 0, totalViews: 0, totalApplications: 0, urgentJobs: 0, featuredJobs: 0
            },
            monthlyStats,
            jobTypeStats
        });
    } catch (error) {
        console.error('getJobStats error:', error);
        return res.status(500).json({
            message: 'Error fetching job statistics.',
            success: false,
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED SAMPLE INTERNSHIPS
// ─────────────────────────────────────────────────────────────────────────────
export const seedInternships = async (req, res) => {
    try {
        const defaultInternships = [
            {
                title: "Software Development Internship",
                description: "Join our engineering team to work on real-world software development projects. You'll collaborate with senior developers, participate in code reviews, and contribute to our codebase.",
                requirements: ["Knowledge of programming basics", "Familiarity with Git", "Good problem-solving skills", "Eagerness to learn"],
                skills: ["JavaScript", "Python", "Git", "SQL"],
                salary: "Stipend-based",
                salaryMin: 5000,
                salaryMax: 15000,
                experienceLevel: "Fresher",
                location: "Bangalore",
                jobType: "Internship",
                workMode: "Hybrid",
                position: 5,
                
                stipendAmount: 10000,
                stipendType: "Fixed",
                duration: 3,
                whoCanApply: "Students and freshers",
                benefits: ["Certificate", "Letter of Recommendation", "Flexible Hours"]
            },
            {
                title: "Web Development Internship",
                description: "Build modern web applications using cutting-edge technologies. Work on both frontend and backend components of our platform.",
                requirements: ["HTML/CSS basics", "JavaScript knowledge", "Understanding of responsive design"],
                skills: ["React", "Node.js", "MongoDB", "CSS"],
                salary: "Stipend-based",
                salaryMin: 8000,
                salaryMax: 20000,
                experienceLevel: "Fresher",
                location: "Mumbai",
                jobType: "Internship",
                workMode: "Remote",
                position: 3,
                
                stipendAmount: 12000,
                stipendType: "Fixed",
                duration: 6,
                whoCanApply: "Computer science students",
                benefits: ["Certificate", "Flexible Hours", "Work from Home"]
            },
            {
                title: "Android Development Internship",
                description: "Develop mobile applications for millions of users. Learn Android development best practices and contribute to our mobile products.",
                requirements: ["Java or Kotlin basics", "Understanding of mobile UI", "Problem-solving ability"],
                skills: ["Kotlin", "Java", "Android Studio", "Firebase"],
                salary: "Stipend-based",
                salaryMin: 10000,
                salaryMax: 25000,
                experienceLevel: "Fresher",
                location: "Delhi",
                jobType: "Internship",
                workMode: "On-site",
                position: 4,
                stipendAmount: 15000,
                stipendType: "Fixed",
                duration: 4,
                whoCanApply: "Mobile development enthusiasts",
                benefits: ["Certificate", "Mentorship", "Job Offer on Completion"]
            },
            {
                title: "Data Science Internship",
                description: "Work with data to uncover insights and build predictive models. Apply machine learning techniques to solve real business problems.",
                requirements: ["Python programming", "Statistics knowledge", "Basic machine learning concepts"],
                skills: ["Python", "Pandas", "Scikit-learn", "TensorFlow"],
                salary: "Stipend-based",
                salaryMin: 12000,
                salaryMax: 30000,
                experienceLevel: "Fresher",
                location: "Hyderabad",
                jobType: "Internship",
                workMode: "Hybrid",
                position: 3,
                stipendAmount: 18000,
                stipendType: "Fixed",
                duration: 6,
                whoCanApply: "Data science students",
                benefits: ["Certificate", "Real Project Experience", "Performance Bonus"]
            },
            {
                title: "UI/UX Design Internship",
                description: "Design beautiful and user-friendly interfaces. Create wireframes, prototypes, and high-fidelity designs for web and mobile applications.",
                requirements: ["Design sense", "Familiarity with design tools", "User empathy", "Attention to detail"],
                skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
                salary: "Stipend-based",
                salaryMin: 8000,
                salaryMax: 20000,
                experienceLevel: "Fresher",
                location: "Pune",
                jobType: "Internship",
                workMode: "Remote",
                position: 2,
                stipendAmount: 12000,
                stipendType: "Fixed",
                duration: 3,
                whoCanApply: "Design students and creatives",
                benefits: ["Certificate", "Portfolio Building", "Flexible Hours"]
            },
            {
                title: "Cloud Computing Internship",
                description: "Learn cloud infrastructure and deployment. Work with AWS, Azure, and Google Cloud platforms to deploy and manage applications.",
                requirements: ["Basic Linux knowledge", "Networking concepts", "Willingness to learn cloud technologies"],
                skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
                salary: "Stipend-based",
                salaryMin: 15000,
                salaryMax: 35000,
                experienceLevel: "Fresher",
                location: "Bangalore",
                jobType: "Internship",
                workMode: "Hybrid",
                position: 3,
                stipendAmount: 20000,
                stipendType: "Fixed",
                duration: 6,
                whoCanApply: "Cloud computing aspirants",
                benefits: ["Certificate", "AWS Certification Support", "Job Offer"]
            },
            {
                title: "Machine Learning Internship",
                description: "Build and deploy machine learning models. Work on NLP, computer vision, and predictive analytics projects.",
                requirements: ["Python proficiency", "ML fundamentals", "Mathematics background", "Experience with ML frameworks"],
                skills: ["Python", "TensorFlow", "PyTorch", "OpenCV"],
                salary: "Stipend-based",
                salaryMin: 15000,
                salaryMax: 40000,
                experienceLevel: "Fresher",
                location: "Chennai",
                jobType: "Internship",
                workMode: "On-site",
                position: 4,
                stipendAmount: 25000,
                stipendType: "Fixed",
                duration: 6,
                whoCanApply: "ML enthusiasts with projects",
                benefits: ["Certificate", "Research Publication", "Conference Attendance"]
            },
            {
                title: "DevOps Internship",
                description: "Automate deployment pipelines and manage infrastructure. Learn CI/CD, containerization, and infrastructure as code.",
                requirements: ["Linux administration", "Scripting knowledge", "Understanding of networking"],
                skills: ["Jenkins", "Docker", "Git", "Ansible"],
                salary: "Stipend-based",
                salaryMin: 12000,
                salaryMax: 30000,
                experienceLevel: "Fresher",
                location: "Gurgaon",
                jobType: "Internship",
                workMode: "Hybrid",
                position: 3,
                stipendAmount: 18000,
                stipendType: "Fixed",
                duration: 4,
                whoCanApply: "DevOps aspirants",
                benefits: ["Certificate", "Tool Training", "Performance Bonus"]
            }
        ];

        let created = 0;
        let skipped = 0;

        const companies = await Company.find().limit(1);
        if (companies.length === 0) {
            return res.status(400).json({
                message: "Please create a company first before seeding internships.",
                success: false
            });
        }

        const companyId = companies[0]._id;
        const userId = req.id;

        for (const intern of defaultInternships) {
            const existing = await Job.findOne({ title: intern.title, company: companyId, jobType: "Internship" });
            if (existing) {
                skipped++;
                continue;
            }

            await Job.create({
                ...intern,
                company: companyId,
                created_by: userId,
                status: "active"
            });
            created++;
        }

        return res.status(201).json({
            message: `Seeded ${created} new internships. ${skipped} skipped (already exist).`,
            created,
            skipped,
            success: true
        });
    } catch (error) {
        console.error('seedInternships error:', error);
        return res.status(500).json({
            message: 'Error seeding internships.',
            success: false,
            error: error.message,
        });
    }
};
