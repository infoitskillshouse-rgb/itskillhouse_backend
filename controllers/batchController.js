import UpcomingBatch from "../models/upcomingBatchSchema.js";

export const createBatch = async (req, res) => {
  try {
    const {
      courseName,
      courseSlug,
      startDate,
      duration,
      timing,
      mode,
      seatsTotal,
      seatsLeft,
      fee,
      discount,
      certificate
    } = req.body;

    // validation
    if (!courseName || !courseSlug || !startDate || !duration || !fee) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // duplicate slug check
    const existingBatch = await UpcomingBatch.findOne({ courseSlug });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "Batch with this courseSlug already exists"
      });
    }

    // seats validation
    if (seatsLeft > seatsTotal) {
      return res.status(400).json({
        success: false,
        message: "Seats left cannot be greater than total seats"
      });
    }

    const batch = await UpcomingBatch.create({
      courseName,
      courseSlug,
      startDate,
      duration,
      timing,
      mode,
      seatsTotal,
      seatsLeft,
      fee,
      discount,
      certificate
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch
    });

  } catch (error) {
    console.error("Create Batch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



export const getBatches = async (req, res) => {
  try {

    const batches = await UpcomingBatch.find({ isActive: true })
      .sort({ startDate: 1 });

    return res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });

  } catch (error) {

    console.error("Get Batches Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};


export const getBatchById = async (req, res) => {
  try {

    const batch = await UpcomingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: batch
    });

  } catch (error) {

    console.error("Get Batch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const updateBatch = async (req, res) => {
  try {

    const batch = await UpcomingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found"
      });
    }

    const updatedBatch = await UpcomingBatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: updatedBatch
    });

  } catch (error) {

    console.error("Update Batch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};



export const deleteBatch = async (req, res) => {
  try {

    const batch = await UpcomingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found"
      });
    }

    await UpcomingBatch.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully"
    });

  } catch (error) {

    console.error("Delete Batch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};