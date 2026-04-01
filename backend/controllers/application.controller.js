import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/mailer.js";
import { applicationConfirmationEmail, statusUpdateEmail } from "../utils/emailTemplates.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId  = req.params.id;

    if (!jobId) return res.status(400).json({ message: "Job id is required.", success: false });

    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job", success: false });
    }

    const job = await Job.findById(jobId).populate("company");
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    const newApplication = await Application.create({ job: jobId, applicant: userId });
    job.applications.push(newApplication._id);
    await job.save();

    // ── Send confirmation email ──
    try {
      const user = await User.findById(userId).select("fullname email");
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: `✅ Application Submitted — ${job.title} at ${job.company?.name || "Company"}`,
          html: applicationConfirmationEmail({
            userName:    user.fullname,
            jobTitle:    job.title,
            companyName: job.company?.name || "the company",
            jobLocation: job.location,
            jobType:     job.jobType,
          }),
        });
      }
    } catch (mailErr) {
      console.error("Email send failed (apply):", mailErr.message);
    }

    return res.status(201).json({ message: "Job applied successfully.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      })
      .populate("applicant", "fullname email");

    if (!application) return res.status(404).json({ message: "No Applications", success: false });
    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant" },
    });

    if (!job) return res.status(404).json({ message: "Job not found.", success: false });
    return res.status(200).json({ job, succees: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate({ path: "job", populate: { path: "company" } })
      .populate("applicant", "fullname email");
    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) return res.status(400).json({ message: "status is required", success: false });

    const application = await Application.findById(applicationId)
      .populate({ path: "job", populate: { path: "company" } })
      .populate("applicant", "fullname email");

    if (!application) return res.status(404).json({ message: "Application not found.", success: false });

    application.status = status.toLowerCase();
    await application.save();

    // ── Send status update email ──
    try {
      const user = application.applicant;
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: `📬 Application Update — ${application.job?.title} at ${application.job?.company?.name || "Company"}`,
          html: statusUpdateEmail({
            userName:    user.fullname,
            jobTitle:    application.job?.title,
            companyName: application.job?.company?.name || "the company",
            status:      status.toLowerCase(),
          }),
        });
      }
    } catch (mailErr) {
      console.error("Email send failed (status):", mailErr.message);
    }

    return res.status(200).json({ message: "Status updated successfully.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findByIdAndDelete(applicationId);

    if (!application) return res.status(404).json({ message: "Application not found.", success: false });

    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: applicationId }
    });

    return res.status(200).json({ message: "Application deleted successfully.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
