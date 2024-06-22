import express from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { userModel } from "../db-utils/model.js";

const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  const userData = req.body;

  try {
    const existingUser = await userModel.findOne({ email: userData.email });

    if (existingUser) {
      return res.status(409).send({
        msg: "Please select a different email id",
        err: "email already exists",
      });
    }

    bcrypt.hash(userData.password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ msg: "Internal server error", err: err });
      }
      try {
        await userModel.create({ ...userData, id: nanoid(10), password: hash });
        return res.status(201).send({ msg: "User Created Successfully" });
      } catch (error) {
        console.error("Error creating user:", createError);
        return res.status(500).send({
          msg: "Internal Server Error",
          err: "An error occurred while creating the user",
        });
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send({
      msg: "Internal Server Error",
      err: "An error occurred while creating the user",
    });
  }
});

export default registerRouter;
