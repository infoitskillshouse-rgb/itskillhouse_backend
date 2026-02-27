import Admin from "../models/Admin.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";


/* ===============================
   Helper Functions
================================= */

const isValidObjectId = (id) =>
mongoose.Types.ObjectId.isValid(id);


/* ===============================
   Admin Login
================================= */

export const loginAdmin = async (req,res)=>{
try{

const {email,password}=req.body;

if(!email?.trim() || !password?.trim()){
return res.status(400).json({
success:false,
message:"Email & Password required"
});
}

const admin = await Admin.findOne({
email:email.trim().toLowerCase()
}).select("+password");

if(!admin){
return res.status(401).json({
success:false,
message:"Invalid credentials"
});
}

const isMatch = await admin.comparePassword(password);

if(!isMatch){
return res.status(401).json({
success:false,
message:"Invalid credentials"
});
}

const token = admin.getJWT();

res.cookie("token",token,{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"strict",
maxAge:7*24*60*60*1000,
path:"/"
});

res.json({
success:true,
message:"Login successful",
token
});

}catch(error){

console.error("Login Error:",error);

res.status(500).json({
success:false,
message:"Server error"
});
}
};



/* ===============================
   Logout
================================= */

export const logoutAdmin=(req,res)=>{

res.cookie("token","",{
httpOnly:true,
expires:new Date(0),
path:"/"
});

res.json({
success:true,
message:"Logged out successfully"
});
};



/* ===============================
   Get Profile
================================= */

export const getAdminProfile = async(req,res)=>{

try{

if(!req.adminId){
return res.status(401).json({
success:false,
message:"Unauthorized"
});
}

if(!isValidObjectId(req.adminId)){
return res.status(400).json({
success:false,
message:"Invalid admin id"
});
}

const admin = await Admin.findById(req.adminId)
.select("-password");

if(!admin){
return res.status(404).json({
success:false,
message:"Admin not found"
});
}

res.json({
success:true,
admin
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:"Server error"
});
}
};



/* ===============================
   Update Profile
================================= */

export const updateAdminProfile = async(req,res)=>{

try{

const {name,email}=req.body;

if(!req.adminId){
return res.status(401).json({
success:false,
message:"Unauthorized"
});
}

const admin = await Admin.findById(req.adminId);

if(!admin){
return res.status(404).json({
success:false,
message:"Admin not found"
});
}


if(name?.trim()){
admin.name=name.trim();
}

if(email?.trim()){

const newEmail=email.trim().toLowerCase();

const exists = await Admin.findOne({
email:newEmail,
_id:{$ne:req.adminId}
});

if(exists){
return res.status(400).json({
success:false,
message:"Email already used"
});
}

admin.email=newEmail;

}

await admin.save();

res.json({
success:true,
message:"Profile updated successfully"
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:"Server error"
});
}
};



/* ===============================
   Change Password
================================= */

export const changePassword = async(req,res)=>{

try{

const {oldPassword,newPassword}=req.body;

if(!oldPassword || !newPassword){
return res.status(400).json({
success:false,
message:"All fields required"
});
}

if(newPassword.length<6){
return res.status(400).json({
success:false,
message:"Password must be at least 6 characters"
});
}

const admin = await Admin.findById(req.adminId)
.select("+password");

if(!admin){
return res.status(404).json({
success:false,
message:"Admin not found"
});
}

const isMatch =
await admin.comparePassword(oldPassword);

if(!isMatch){
return res.status(401).json({
success:false,
message:"Old password incorrect"
});
}

admin.password=newPassword;

await admin.save();

res.json({
success:true,
message:"Password changed successfully"
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:"Server error"
});
}
};



/* ===============================
   Create Admin
================================= */

export const createAdmin = async(req,res)=>{

try{

const {name,email,password}=req.body;

if(!name?.trim() ||
!email?.trim() ||
!password?.trim()){

return res.status(400).json({
success:false,
message:"All fields required"
});
}

if(password.length<6){
return res.status(400).json({
success:false,
message:"Password must be at least 6 characters"
});
}

const exists=
await Admin.findOne({
email:email.trim().toLowerCase()
});

if(exists){
return res.status(400).json({
success:false,
message:"Admin already exists"
});
}

await Admin.create({
name:name.trim(),
email:email.trim().toLowerCase(),
password
});

res.json({
success:true,
message:"Admin created successfully"
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:"Server error"
});
}
};



/* ===============================
   Forgot Password
================================= */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`;

    // Manually send email
    try {
      await sendEmail({
        to: admin.email,
        subject: "Password Reset Request",
        html: `
          <h2>Password Reset</h2>
          <p>Hello ${admin.name},</p>
          <p>Click the link below to reset your password. The link is valid for 10 minutes.</p>
          <a href="${resetURL}" target="_blank">${resetURL}</a>
          <p>If you did not request this, ignore this email.</p>
        `,
      });
      console.log("Reset email sent manually to:", admin.email);
    } catch (emailError) {
      console.error("Manual Email Sending Error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
      });
    }

    res.json({
      success: true,
      message: "Password reset link sent manually",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ===============================
   Reset Password
================================= */

export const resetPassword = async (req, res) => {
  try {

    const { password, confirmPassword } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // confirmPassword optional, agar hai to match kare
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!req.params.token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};