import dotenv from "dotenv";
dotenv.config({
    path:'.env'
})

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./routes/users.routes";
import { AdminRouter } from "./routes/admin.routes";
import { TrainRouter } from "./routes/train.routes";


export const app = express();



app.use(express.json());
app.use(cors());
app.use(helmet());


app.use(userRouter);
app.use(AdminRouter);
app.use(TrainRouter);
