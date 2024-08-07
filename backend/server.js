import express from "express";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());// to parse the incoming requests with zero payloads(from req.body)

app.use("/api/auth", authRoute);

app.post("/api/auth/signup", (req, res)=>{
    res.send("hello world!");
})

app.listen(PORT, ()=> {
    connectToMongoDB();
    console.log(`Server started at : ${PORT}`);
});