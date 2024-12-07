import { Router } from "express";
import { UserController } from "../controllers/users.controller";


export const userRouter = Router(); 


userRouter.post("/usersignup",UserController.userSignUp);
userRouter.post("/usersignin",UserController.userSignIn);
