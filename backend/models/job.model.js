import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
    skills: [{
        type: String,
        trim: true
    }],
    salary: {
        type: String,
        required: true
    },
    salaryMin: {
        type: Number,
        default: 0
    },
    salaryMax: {
        type: Number,
        default: 0
    },
    experienceLevel: {
        type: String,
        enum: ["Fresher", "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"],
        required: true
    },
    experienceYears: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
        required: true
    },
    workMode: {
        type: String,
        enum: ["On-site", "Remote", "Hybrid"],
        default: "On-site"
    },
    position: {
        type: Number,
        required: true,
        min: 1
    },
    positionsOpen: {
        type: Number,
        default: function() { return this.position; }
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["active", "closed", "paused", "draft"],
        default: "active"
    },
    urgent: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    benefits: [{
        type: String
    }],
    responsibilities: [{
        type: String
    }],
    qualifications: [{
        type: String
    }],
    applicationDeadline: {
        type: Date,
        default: null
    },
    applicationCount: {
        type: Number,
        default: 0
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
    views: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    stipendAmount: {
        type: Number,
        default: 0
    },
    stipendType: {
        type: String,
        enum: ["Fixed", "Negotiable", "Unpaid", "Performance-based"],
        default: "Negotiable"
    },
    duration: {
        type: Number,
        default: 3
    },
    whoCanApply: {
        type: String,
        default: null
    }
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export const Job = mongoose.model("Job", jobSchema);
