import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },

  password: { 
    type: String, 
    required: true,
    select: false
  },

  resetPasswordToken: String,

  resetPasswordExpire: Date,

},{
  timestamps: true
});


/* PASSWORD HASH */

adminSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

});


/* PASSWORD MATCH */

adminSchema.methods.comparePassword = async function(password) {

  return await bcrypt.compare(password, this.password);

};


/* JWT */

adminSchema.methods.getJWT = function() {

  return jwt.sign(
    {
      id: this._id,
      role: "admin"
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "7d"
    }
  );

};


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;