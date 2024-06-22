import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoConnect from "./db-utils/mongoConnect.js";

const server = express();
const port = 8100;

dotenv.config;

server.use(express.json());

server.use(cors());

mongoConnect();

server.listen(port, () => {
  console.log(`${Date().toString()} - server listening on port ${port}`);
});
