import { Request,Response,NextFunction } from "express"
import { prisma } from "../services/database.services";


export const adminMiddleware = async (req:Request,res:Response,next:NextFunction): Promise<any> =>{
    try {
        const adminapikey =  req.headers['apikey'];
        if(!adminapikey){
            return res.status(401).json({message:"Api key is missing"})
        }
        const searchapiKey = await prisma.apiKey.findFirst({
            where:{
                apikey:adminapikey as string
            }
        })
        if(!searchapiKey){
            res.status(404).json({message:"API key not founded"})
        }
        const findadminId =  searchapiKey?.adminid as any
        const findUser = await prisma.admin.findFirst({
            where:{
                id:findadminId
            }
        })
        if(!findUser){
            res.status(404).json({message:"Admin Not Found"})
        }
        // @ts-ignore
        req.adminEmail =  findUser?.email
        next()
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}