import { SavedJob } from "../models/savedJob.model.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.id;

    const existingSave = await SavedJob.findOne({ user: userId, job: jobId });
    if (existingSave) {
      return res.status(400).json({ message: "Job already saved", success: false });
    }

    await SavedJob.create({ user: userId, job: jobId });
    return res.status(201).json({ message: "Job saved successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;

    await SavedJob.findOneAndDelete({ user: userId, job: jobId });
    return res.status(200).json({ message: "Job unsaved successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const savedJobs = await SavedJob.find({ user: userId })
      .populate({
        path: "job",
        populate: { path: "company" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ savedJobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
