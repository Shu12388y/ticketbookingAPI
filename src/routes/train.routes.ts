import { Router } from "express";
import { CreateTrainList } from "../controllers/createTrainList.controller";
import { userMiddleware } from "../middleware/user.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
export const TrainRouter = Router();


TrainRouter.post("/admin/createtrainlist",adminMiddleware,CreateTrainList.createTrainList);
TrainRouter.get("/searchtrain",userMiddleware,CreateTrainList.getParticularTrain);
TrainRouter.post("/service/book/:trainNumber",userMiddleware,CreateTrainList.BookTicket as any);
TrainRouter.put("/admin/updatetrainlist/:trainNumber",adminMiddleware,CreateTrainList.updateTrainList);
TrainRouter.delete("/admin/deletetrainlist/:trainNumber",adminMiddleware,CreateTrainList.deleteTrainList);
