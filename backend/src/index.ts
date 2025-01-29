import express  from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv"
import { userrouter } from "./routes/user.router";
import { errorHandler } from "./middlewares/errorhandler";
const app = express();
dotenv.config({
  path: './.env'
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

connectDB();
app.get("/", (req, res) => {
  console.log(req.headers["user-agent"]);
  res.send("Hello World!");
});


app.use("/api/auth", userrouter);



app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});