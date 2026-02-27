import Portfolio from "../models/Portfolio.js";
import mongoose from "mongoose";

/**
 * GET all portfolio items
 */
export const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: portfolios,
    });

  } catch (error) {
    console.error("Get Portfolios Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * GET portfolio by ID
 */
export const getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: portfolio,
    });

  } catch (error) {
    console.error("Get Portfolio Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * CREATE portfolio
 */
export const createPortfolio = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Portfolio data is required",
      });
    }

    const portfolio = await Portfolio.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: portfolio,
    });

  } catch (error) {
    console.error("Create Portfolio Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create portfolio",
    });
  }
};


/**
 * UPDATE portfolio
 */
export const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Update data is required",
      });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedPortfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: updatedPortfolio,
    });

  } catch (error) {
    console.error("Update Portfolio Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update portfolio",
    });
  }
};


/**
 * DELETE portfolio
 */
export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

    if (!deletedPortfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });

  } catch (error) {
    console.error("Delete Portfolio Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
