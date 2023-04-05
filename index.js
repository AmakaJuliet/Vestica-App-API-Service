if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRouter = require("./routes/noteRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
mongoose.set('strictQuery', true);

async function startDB() {
    try {
        await mongoose.connect(process.env.MONG0_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database is connected...");
    } catch (error) {
        console.log(`Database failed to connect: ${error.message}`);
    }
}

const app = express();
startDB();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const api_version = "v1";

app.get(`/${api_version}`, (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the Vestica App API Backend v1"
    });
});

app.use(`/${api_version}/auth`, authRouter);
app.use(`/${api_version}/user`, userRouter);
app.use(`/${api_version}/note`, noteRouter);



const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Backend Server is running on ${PORT}`);
});