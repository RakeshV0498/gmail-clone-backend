import { Schema, model } from "mongoose";

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  recoveryEmail: {
    type: String,
    require: true,
  },
  resetToken: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const emailSchema = new Schema({
  id: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  cc: { type: String },
  bcc: { type: String },
  subject: { type: String },
  body: { type: String },
  folder: {
    type: String,
    enum: ["inbox", "sent", "drafts", "starred", "trash"],
    required: true,
  },
  starred: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
});

const userModel = new model("User", userSchema, "Users");
const emailModel = new model("Email", emailSchema, "Emails");

export { userModel, emailModel };
