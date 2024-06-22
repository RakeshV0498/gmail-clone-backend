import express from "express";
import { userModel } from "../db-utils/model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body.loginData;

  const existingUser = await userModel.findOne({ email });

  if (!existingUser) {
    return res.status(404).send({ msg: "User not found" });
  }

  try {
    bcrypt.compare(password, existingUser.password, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: "Something went wrong, Please try again later" });
      }
      if (result) {
        const { id, email, firstName, lastName, active } = userObj;

        const token = jwt.sign(
          { id, email, firstName, lastName, active },
          process.env.JWT_SECRETKEY,
          {
            expiresIn: "1d",
          }
        );

        return res
          .status(200)
          .send({ msg: "User Successfully logged in", code: 1, user: token });
      } else {
        return res
          .status(400)
          .send({ msg: "User Credentials failed", code: 0 });
      }
    });
  } catch (error) {
    console.error("Error loggin in:", error);
    return res.status(500).send({
      msg: "Internal Server Error",
      err: "An error occurred while creating the user",
    });
  }
});

export default loginRouter;
