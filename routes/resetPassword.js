import express from "express";
import bcrypt from "bcrypt";
import { userModel } from "../db-utils/model.js";

const resetPassRouter = express.Router();

resetPassRouter.post("/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the user with the provided reset token
    const user = await userModel.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Verify if the token expiry time is still valid
    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default resetPassRouter;
