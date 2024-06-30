import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { userModel, emailModel } from "../db-utils/model.js";

dotenv.config();

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization; // Assuming token is passed in the Authorization header

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded; // Store decoded user information in request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

const emailRouter = express.Router();

emailRouter.use(verifyToken);

emailRouter.get("/validateEmail/:email", async (req, res) => {
  // Split the email string into an array and filter out empty strings
  const emails = req.params.email
    .split(";")
    .filter((email) => email.trim() !== "");

  try {
    // Validate each email in the array
    const validationResults = await Promise.all(
      emails.map(async (email) => {
        const trimmedEmail = email.trim();
        const existingUser = await userModel.findOne({ email: trimmedEmail });
        return existingUser
          ? { email: trimmedEmail, valid: true }
          : { email: trimmedEmail, valid: false };
      })
    );

    // Filter out invalid emails
    const invalidEmails = validationResults.filter((result) => !result.valid);
    if (invalidEmails.length > 0) {
      return res.status(400).send({
        invalidEmails,
        msg: "Some email addresses are invalid",
        code: 0,
      });
    }

    return res
      .status(200)
      .send({ msg: "All email addresses are valid", code: 1 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later." });
  }
});

emailRouter.get("/inbox", async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract user email from decoded token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [emails, totalEmails] = await Promise.all([
      emailModel
        .find({ to: userEmail, folder: "inbox" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      emailModel.countDocuments({ to: userEmail, folder: "inbox" }),
    ]);

    res.status(200).json({ emails, totalEmails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.get("/sentItems", async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract user email from decoded token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [emails, totalEmails] = await Promise.all([
      emailModel
        .find({ from: userEmail, folder: "sent" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      emailModel.countDocuments({ from: userEmail, folder: "sent" }),
    ]);

    res.status(200).json({ emails, totalEmails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.get("/drafts", async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract user email from decoded token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [emails, totalEmails] = await Promise.all([
      emailModel
        .find({ from: userEmail, folder: "drafts" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      emailModel.countDocuments({ from: userEmail, folder: "drafts" }),
    ]);

    res.status(200).json({ emails, totalEmails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.get("/starred", async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract user email from decoded token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [emails, totalEmails] = await Promise.all([
      emailModel
        .find({ to: userEmail, starred: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      emailModel.countDocuments({ to: userEmail, starred: true }),
    ]);

    res.status(200).json({ emails, totalEmails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.get("/trash", async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract user email from decoded token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [emails, totalEmails] = await Promise.all([
      emailModel
        .find({
          $or: [{ to: userEmail }, { from: userEmail }],
          folder: "trash",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      emailModel.countDocuments({ from: userEmail, folder: "trash" }),
    ]);

    res.status(200).json({ emails, totalEmails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.get("/all", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 emails per page
  const skip = (page - 1) * limit;

  try {
    const userEmail = req.user.email; // Extract user email from decoded token
    const emails = await emailModel
      .find({
        $or: [
          { folder: "sent", from: userEmail },
          {
            folder: { $ne: "sent" },
            $or: [{ from: userEmail }, { to: userEmail }],
          },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalEmails = await emailModel.countDocuments({
      folder: { $ne: "sent" },
      $or: [{ from: userEmail }, { to: userEmail }],
    });

    res.status(200).json({ emails, totalEmails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.post("/draftEmail", async (req, res) => {
  let emailData = req.body;

  try {
    const existingEmail = await emailModel.findOne({ id: emailData.id });

    if (existingEmail) {
      // Update existing draft email
      await emailModel.updateOne(
        { id: emailData.id },
        { ...emailData, folder: "drafts" }
      );
      return res.status(208).send({ msg: "Draft Updated..." });
    }

    // Create new draft email
    await emailModel.create({ ...emailData, folder: "drafts" });

    return res.status(201).send({ msg: "Draft Inserted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.post("/sendEmail", async (req, res) => {
  let emailData = req.body;

  try {
    // Find the sender
    const sender = await userModel.findOne({ email: emailData.from });
    if (!sender) return res.status(404).send({ msg: "Sender not found" });

    // Split recipients by semicolons if they exist
    const recipients = {
      to: emailData.to
        ? emailData.to
            .split(";")
            .map((email) => email.trim())
            .filter(Boolean)
        : [],
      cc: emailData.cc
        ? emailData.cc
            .split(";")
            .map((email) => email.trim())
            .filter(Boolean)
        : [],
      bcc: emailData.bcc
        ? emailData.bcc
            .split(";")
            .map((email) => email.trim())
            .filter(Boolean)
        : [],
    };

    // Combine all recipients into a single array
    const allRecipients = Array.from(
      new Set([...recipients.to, ...recipients.cc, ...recipients.bcc])
    );

    // Check if all recipients exist in the database
    const users = await userModel.find({ email: { $in: allRecipients } });
    if (users.length !== allRecipients.length) {
      const existingEmails = users.map((user) => user.email);

      const missingEmails = allRecipients.filter(
        (email) => !existingEmails.includes(email)
      );

      return res
        .status(404)
        .send({ msg: `Recipient(s) not found: ${missingEmails.join(", ")}` });
    }

    // Save the sent email to the "sent" folder
    const sentEmail = new emailModel({ ...emailData, folder: "sent" });
    await sentEmail.save();

    // Save copies of the email to recipients' "inbox" folders
    for (const user of users) {
      const inboxEmail = new emailModel({
        ...emailData,
        id: nanoid(10),
        folder: "inbox",
        to: user.email, // Set the recipient's email as the "to" field
      });
      await inboxEmail.save();
    }

    return res.status(200).send({ msg: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.patch("/addStar/:id", async (req, res) => {
  const { id } = req.params; // Destructure id from req.params
  const { folder } = req.body;

  try {
    const existingEmail = await emailModel.findOne({ id, folder }); // Find email by id
    if (!existingEmail) {
      return res.status(404).send({ msg: "Email not found" });
    }

    // Toggle the starred status
    existingEmail.starred = !existingEmail.starred;

    // Save the updated email
    await existingEmail.save();

    return res
      .status(200)
      .send({ msg: "Star toggled successfully", email: existingEmail });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.patch("/trash/:id", async (req, res) => {
  try {
    const emailId = req.params.id;

    const email = await emailModel.findOne({
      id: emailId,
    });

    if (!email) {
      return res.status(404).send({
        msg: "Email not found or you do not have permission to move this email to trash",
      });
    }

    // Update the folder to 'trash'
    await emailModel.updateOne({ id: emailId }, { folder: "trash" });

    return res.status(200).send({ msg: "Email moved to trash successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
});

emailRouter.delete("/delete/:id", async (req, res) => {
  try {
    const emailId = req.params.id;
    const userEmail = req.user.email;

    // Find the email by 'id' and delete it
    const deletedEmail = await emailModel.findOneAndDelete({
      id: emailId,
      folder: "trash",
    });

    if (!deletedEmail) {
      return res.status(404).json({
        msg: "Email not found or you do not have permission to delete this email",
      });
    }

    return res.status(200).json({ msg: "Email deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later" });
  }
});

export default emailRouter;
