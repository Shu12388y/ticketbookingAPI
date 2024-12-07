import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { adminMiddleware } from "../middleware/admin.middleware";


export const AdminRouter = Router();



AdminRouter.post("/adminsignup",AdminController.adminSignUp);
AdminRouter.post("/adminsignin",AdminController.adminSignIn);