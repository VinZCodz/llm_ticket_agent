import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.ts"

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.use("api/auth", userRoutes)

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log("Mongo DB Connected.")
        app.listen(PORT, () => console.log(`Server Up and Running at Port: ${PORT}`))
    })
    .catch((err) => console.error(`Mongo DB Errored! ${err}`))