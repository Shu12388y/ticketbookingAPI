import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../services/database.services";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authTokenCheck = req.headers['authtoken'];
    
  
    if (!authTokenCheck) {
    res.status(401).json({ message: "Auth token is required" });
    }

  
    const secretKey = "secert"; 
    const decodeToken = jwt.verify(authTokenCheck as string, secretKey) as JwtPayload;

    const checkUser =  await prisma.user.findUnique({
        where:{
            email:decodeToken.userData.email
        }
    })
    if(!checkUser){
        res.status(401).json({message:"Invalid user token"})
    }
    // @ts-ignore
    req.userInfo = decodeToken.userData
    next();
  } catch (error) {
    console.error("Error in userMiddleware:", error);

  
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired token" });
    }

    
    res.status(500).json({ message: "Server error" });
  }
};
