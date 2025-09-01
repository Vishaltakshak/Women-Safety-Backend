import mongoose, { SchemaTypes } from "mongoose";
import bcrypt from "bcrypt";

// ✅ Define schema directly as an object
const UserSchema = new mongoose.Schema({
  Name: { type: SchemaTypes.String, required: true, minLength: 5 },
  Mail: { type: SchemaTypes.String, required: true, minLength: 5 },
  Password: { type: SchemaTypes.String, required: true, minLength: 8, select: false },
  PhoneNumber: { type: SchemaTypes.String, required: true, minLength: 10 },
  Address:{type:SchemaTypes.String, required:true},
  imgURL:{type:SchemaTypes.String, required:true},
  EmergencyContacts: [
    {
      Name: { type: SchemaTypes.String },
      PhoneNumber: { type: SchemaTypes.String },
    },
  ],
});

// ✅ Add password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

// ✅ Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

// ✅ Finally export model
const user = mongoose.model("users", UserSchema);
export default user;
