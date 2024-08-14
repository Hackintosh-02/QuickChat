import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoute from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());// to parse the incoming requests with zero payloads(from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages",messageRoutes);
app.use("/api/users", userRoute);


app.post("/api/auth/signup", (req, res)=>{
    res.send("hello world!");
})

app.listen(PORT, ()=> {
    connectToMongoDB();
    console.log(`Server started at : ${PORT}`);
});