import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/midful.routes.js";
import adminRoutes from "./routes/midless.routes.js";
import {config} from "./config/db_config.js";
import dotenv from 'dotenv-flow';
dotenv.config({ path: 'local.env' });
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import * as auth from "./middleware/auth.middleware.js";

//const url = process.env.MONGODB_URI || `mongodb://${config.dbhost}:${config.dbport}/${config.dbname}`;
const url = process.env.MONGODB_URI;
let retries = 15;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const connectWithRetry = () => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB', err);
            if (retries > 0) {
                retries -= 1;
                console.log(`Retries left: ${retries}`);
                setTimeout(connectWithRetry, 5000);
            } else {
                console.error('Max retries reached');
            }
        });
};

const app = express()
const server = http.createServer(app)
export const serverio = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH", "PUT"]
    }
});

app.use(cors())
app.use(fileUpload())
app.use(express.json());
app.use(bodyParser.json());
connectWithRetry();;

app.get("/", (req, res) => {
    res.send("<center><h1 style='margin-top: 20%;color:#0d7dd6; text-transform:uppercase;'>Welcome to the Lambdaa Coding Test</h1><h2 style='color:#0d7dd6;'>BACKEND API</h2></center>")
});

app.use('/static',  express.static(path.join(__dirname,"public")))
app.use("/api/auth", authRoutes);
app.use("/api/user", auth.checkAuthenticated, userRoutes);
app.use("/api/admin", adminRoutes);

app.get("*", (req, res)=>{
    res.status(404).json({message:`Route ${req.path} not found`});
})

export const serverInstance = server.listen(process.env.PORT, (err) => {
    console.log("Server running on port", process.env.PORT)
})

export default app;