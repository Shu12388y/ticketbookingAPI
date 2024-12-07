import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../services/database.services";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authTokenCheck = req.headers['authtoken'];
    
    // Check if the auth token is provided
    if (!authTokenCheck) {
    res.status(401).json({ message: "Auth token is required" });
    }

    // Decode and verify the token
    const secretKey = "secert"; // Replace with your actual secret key
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
    console.log(decodeToken.userData)
    // Attach user info to the request object
    // req.userInfo = decodeToken;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    console.error("Error in userMiddleware:", error);

    // Handle JWT-specific errors
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired token" });
    }

    // Handle other server errors
    res.status(500).json({ message: "Server error" });
  }
};
