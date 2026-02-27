// src/controllers/inquiryController.js
import Inquiry from "../models/Inquiry.js";
import mongoose from "mongoose";

/**
 * Public: Create Inquiry
 */
export const createInquiry = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Inquiry data is required",
      });
    }

    const inquiry = await Inquiry.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });

  } catch (error) {
    console.error("Create Inquiry Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
};


/**
 * Admin: Get All Inquiries
 */
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: inquiries,
    });

  } catch (error) {
    console.error("Get All Inquiries Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * Admin: Get Single Inquiry by ID
 */
export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry,
    });

  } catch (error) {
    console.error("Get Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * Admin: Delete Inquiry
 */
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    const deleted = await Inquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });

  } catch (error) {
    console.error("Delete Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * Admin: Update Inquiry
 */
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Update data is required",
      });
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Update Inquiry Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update inquiry",
    });
  }
};
