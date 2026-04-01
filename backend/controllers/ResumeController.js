import Resume from "../models/ResumeModel.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/datauri.js";

// ---------------- CREATE RESUME ----------------
export const createResume = async (req, res) => {
  try {
    const resume = new Resume({ ...req.body, user: req.id });
    await resume.save();
    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPLOAD RESUME ----------------
export const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUri = getDataUri(file);
    const result = await cloudinary.v2.uploader.upload(fileUri.content, {
      resource_type: "raw",
      folder: "resumes",
    });

    const resume = new Resume({
      user: req.id,
      title: req.body.title || file.originalname,
      fileUrl: result.secure_url,
      fileName: file.originalname,
    });
    await resume.save();

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET MY RESUMES ----------------
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.id }).populate("user", "fullname email");
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET ALL RESUMES ----------------
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().populate("user");
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET RESUME BY ID ----------------
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate("user");
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPDATE RESUME ----------------
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE RESUME ----------------
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
