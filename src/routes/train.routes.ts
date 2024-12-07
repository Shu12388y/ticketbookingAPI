import { Router } from "express";
import { CreateTrainList } from "../controllers/createTrainList.controller";
import { userMiddleware } from "../middleware/user.middleware";
export const TrainRouter = Router();


TrainRouter.post("/admin/createtrainlist",CreateTrainList.createTrainList);
TrainRouter.get("/searchtrain",CreateTrainList.getParticularTrain);
TrainRouter.post("/service/book/:trainNumber",userMiddleware,CreateTrainList.BookTicket as any);