import { Response,Request } from "express";
import { prisma } from "../services/database.services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AdminController{
    static async adminSignUp(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} =  await req.body;
            const findUser =  await prisma.admin.findUnique({
                where:{
                    email:email
                }
            });
            if(findUser){
                res.status(401).json({message:"user already exist"})
            }


            const hashedPassword = await bcrypt.hash(password,10)
            const apiKeyGenrator =  JSON.stringify(await Math.floor(Math.random() * 100000000) + 1)
            
            const adminInfo = await prisma.admin.create({
                data:{
                    email:email,
                    password:hashedPassword
                }
            });
            const apikeyInfo = await prisma.apiKey.create({
                data:{
                    adminid:adminInfo.id,
                    apikey:apiKeyGenrator 
                }
            })
            res.status(201).json({message:"Admin created",apikey:apikeyInfo})
        } catch (error) {
            res.status(505).json({message:"Server Error"})
        }
    }

    static async adminSignIn(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = await req.body;
            if(!email && !password){
                res.status(404).json({message:"Every Field is required"})
            }
            const findUser =  await prisma.admin.findUnique({
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
            const createToken =  await jwt.sign({userData},"adminsecert");
            if(!createToken){
                res.status(500).json({message:"Not able to generate token"})
            }
            res.status(200).json({message:"success",token:createToken})
        } catch (error) {
            res.status(500).json({message:"Server Error"})
        }
    }
}