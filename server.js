import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const server = express();
const port = 8100;

dotenv.config;

server.use(express.json());

server.use(cors());

server.listen(port, () => {
  console.log(`${Date().toString()} - server listening on port ${port}`);
});
