import { Response,Request } from "express";
import { prisma } from "../services/database.services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController{
    static async userSignUp(req:Request,res:Response):Promise<void>{
        try {
            const {username,email,password} =  await req.body;
            const findUser =  await prisma.user.findUnique({
                where:{
                    email:email
                }
            });
            if(findUser){
                res.status(401).json({message:"user already exist"})
            }

            const hashedPassword = await bcrypt.hash(password,10)

            const createNewUser = await prisma.user.create({
                data:{
                    username:username,
                    email:email,
                    password:hashedPassword
                }
            });
            res.status(201).json({message:"user created"})
        } catch (error) {
            res.status(505).json({message:"Server Error"})
        }
    }

    static async userSignIn(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = await req.body;
            if(!email && !password){
                res.status(404).json({message:"Every Field is required"})
            }
            const findUser =  await prisma.user.findUnique({
                where:{
                    email
                },
                select:{
                    email:true,
                    id:true
                }
            })
            const userData = new Object(findUser);
            if(!findUser){
                res.status(404).json({messsage:"User not founded"})
            }
            const createToken =  await jwt.sign({userData},"secert");
            if(!createToken){
                res.status(500).json({message:"Not able to generate token"})
            }
            res.status(200).json({message:"success",token:createToken})
        } catch (error) {
            res.status(500).json({message:"Server Error"})
        }
    }
}