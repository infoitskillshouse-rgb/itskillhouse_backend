// controllers/newsletterController.js
import Subscriber from "../models/subscriberModel.js";
import Newsletter from "../models/newsletterModel.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

// Email validation regex
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

/**
 * 1️⃣ Subscribe user
 */
export const subscribeUser = async (req, res) => {
  try {
    const { name, email, interest } = req.body;

    if (!name || !email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid name and email are required",
      });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    const subscriber = await Subscriber.create({ name, email, interest });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: {
        id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
        interest: subscriber.interest,
        createdAt: subscriber.createdAt,
      },
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Subscription failed",
    });
  }
};

/**
 * 2️⃣ Get all subscribers (Admin)
 */
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .select("name email interest createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscribers",
    });
  }
};

/**
 * 3️⃣ Delete subscriber
 */
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscriber ID",
      });
    }

    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    console.error("Delete Subscriber Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subscriber",
    });
  }
};

/**
 * 4️⃣ Send newsletter (Admin)
 */
export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required",
      });
    }

    const subscribers = await Subscriber.find().select("email");

    if (!subscribers.length) {
      return res.status(400).json({
        success: false,
        message: "No subscribers available",
      });
    }

    const emails = subscribers.map((s) => s.email);

    // Send email
    await sendEmail({ to: emails, subject, html: content });

    // Save newsletter record
    await Newsletter.create({
      subject,
      content,
      sentTo: emails.length,
    });

    return res.status(200).json({
      success: true,
      message: "Newsletter sent successfully",
    });
  } catch (error) {
    console.error("Send Newsletter Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send newsletter",
    });
  }
};

/**
 * 5️⃣ Newsletter stats
 */
export const getNewsletterStats = async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const totalNewsletters = await Newsletter.countDocuments();

    const recentNewsletters = await Newsletter.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("subject sentTo createdAt");

    return res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
        totalNewsletters,
        recentNewsletters,
      },
    });
  } catch (error) {
    console.error("Newsletter Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};

/**
 * 6️⃣ Check if newsletter should show
 */
export const checkNewsletterStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const subscriber = await Subscriber.findOne({ email });

    return res.status(200).json({
      showNewsletter: !subscriber, // false if subscribed, true otherwise
    });
  } catch (error) {
    console.error("Check Newsletter Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check newsletter",
    });
  }
};