import { Response, Request } from "express";
import { prisma } from "../services/database.services";
import { redis } from "../services/redis.services";
export class CreateTrainList {
    private static allocateSeatNumber:any;

  static async createTrainList(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        trainNumber,
        Departure,
        Arrival,
        TotalSeats,
        NumbersofClasses,
        Classes,
        NumberofSeats,
        PricesofSeats,
        DepartureTiming,
        ArrivalTiming,
      } = await req.body;
      const findTrain = await prisma.createTrainJourneyDetail.findUnique({
        where: {
          trainNumber: trainNumber,
        },
      });
      if (findTrain) {
        res.status(400).json({ message: "Train already exist" });
      }
      await prisma.createTrainJourneyDetail.create({
        data: {
          name,
          trainNumber: parseInt(trainNumber),
          Departure,
          Arrival,
          TotalSeats,
          NumbersofClasses: parseInt(NumbersofClasses),
          Classes,
          NumberofSeats,
          PricesofSeats,
          DepartureTiming,
          ArrivalTiming,
        },
      });

    const handleNumberOfSeats =  await redis.set(`TotalSeats:${trainNumber}`,TotalSeats);
    const expireNumberOfSeats =  await redis.expire(`TotalSeats:${trainNumber}`,60*60*60);
    for (let i = 0; i < Classes.length; i++) {
         await redis.set(`${Classes[i]}:${trainNumber}`,NumberofSeats[i])
    }
    for (let i = 0; i < Classes.length; i++) {
         await redis.expire(`${Classes[i]}:${trainNumber}`,60*60*60);
        
    }
      res.status(201).json({ message: "Train Journey Create" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  static async updateTrainList(req: Request, res: Response): Promise<void> {
    try {
      const { trainNumber } = req.params;
      const findTrain = await prisma.createTrainJourneyDetail.findUnique({
        where: {
          trainNumber: parseInt(trainNumber),
        },
      });
      if (!findTrain) {
        res.status(404).json({ message: "Train doesn't Exist" });
      }
      const updateTrainData = await req.body;
      await prisma.createTrainJourneyDetail.update({
        where: {
          trainNumber: parseInt(trainNumber),
        },
        data: {
          ...updateTrainData,
        },
      });
      res.status(200).json({ message: "Train detail updated" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  static async deleteTrainList(req: Request, res: Response): Promise<void> {
    try {
      const { trainNumber } = await req.params;
      await prisma.createTrainJourneyDetail.delete({
        where: {
          trainNumber: parseInt(trainNumber),
        },
      });
      res.status(200).json({ message: "Deleted the train detail" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }


  static async getAllTraindetails(req:Request,res:Response):Promise<void>{
    try {
        const data = await prisma.createTrainJourneyDetail.findMany()
        if(!data){
            res.status(404).json({message:"No data available"})
        }
        res.status(200).json({data:data})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
  }

  static async getParticularTrain(req:Request,res:Response):Promise<void>{
    try {
        const {Arrival,Departure} = req.query;
        const findTheTrain = await prisma.createTrainJourneyDetail.findMany({
            where:{
                Arrival:Arrival as string,
                Departure:Departure as string
            }
        });
        if(!findTheTrain){
            res.status(404).json({mesage:"No Train available"})
        }
        console.log(Arrival,Departure)
        console.log(findTheTrain)
        const responseData = await Promise.all(
            findTheTrain.map(async (train) => {
              const classesWithSeats = await Promise.all(
                train.Classes.map(async (className, index) => {
                  const redisKey = `${className}:${train.trainNumber}`;
                  const checkSeats = await redis.get(redisKey);
                  return {
                    class: className,
                    numberofSeats: checkSeats || "N/A", // Fallback if Redis key is missing
                  };
                })
              );
      
              // Return transformed train details excluding specific fields
              const { Classes, NumberofSeats, TotalSeats, ...trainDetails } = train;
      
              return {
                ...trainDetails,
                classesWithSeats,
              };
            })
          );
      
          console.log("Transformed Train Details:", responseData);
      
          // Send the response
          res.status(200).json({ data: responseData });
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
  }


  static async BookTicket(req: Request, res: Response): Promise<any> {
    try {
      const { trainNumber } = req.params; 
      // @ts-ignore
      const userInfo = req.userInfo as { id: number }; 
      const { Class, numberOfSeats } = req.body; 
      
      // Validate input data
      if (!trainNumber || !Class || !numberOfSeats) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      
      // Find the train details
      const findTrain = await prisma.createTrainJourneyDetail.findUnique({
        where: { trainNumber: parseInt(trainNumber) },
      });
  
      if (!findTrain) {
        return res.status(404).json({ message: "Train not found" });
      }
  
      if (!findTrain.Classes.includes(Class)) {
        return res.status(400).json({ message: `Class ${Class} not available on this train` });
      }
      
      // Check available seats in Redis
      const redisKey = `${Class}:${trainNumber}`;
      const availableSeats = await redis.get(redisKey);
  
      if (!availableSeats || parseInt(availableSeats) < numberOfSeats) {
        return res.status(400).json({ message: "Insufficient seats available" });
      }
  
      // Decrease the seat count in Redis for the specific class
      await redis.set(redisKey, parseInt(availableSeats) - numberOfSeats);
  
      // Check and update total seats for the train in Redis
      const totalSeatKey = `TotalSeats:${trainNumber}`;
      const getTotalSeats = await redis.get(totalSeatKey);
  
      if (!getTotalSeats || parseInt(getTotalSeats) <= 0) {
        return res.status(400).json({ message: "No seats are available" });
      }
  
      await redis.set(totalSeatKey, parseInt(getTotalSeats) - parseInt(numberOfSeats));
  
      // Generate PNR number
      const generatePNRNumber = Math.floor(Math.random() * 1000000) + 1;
  
      // Create tickets
      const tickets = [];
      for (let i = 0; i < numberOfSeats; i++) {
        const maxSeats = findTrain.NumberofSeats[findTrain.Classes.indexOf(Class)];
        const seatNumber = Math.floor(Math.random() * maxSeats) + 1; // Generate number between 1 and maxSeats
      
        const ticket = await prisma.ticketDetails.create({
          data: {
            PNRNumber: generatePNRNumber,
            NameOfTrain: findTrain.name as string,
            TrainNumber: parseInt(trainNumber),
            Arrival: findTrain.Arrival,
            Departure: findTrain.Departure,
            DepartureTiming: findTrain.DepartureTiming,
            ArrivalTiming: findTrain.ArrivalTiming,
            SeatNumber: seatNumber,
            SeatPrice: findTrain.PricesofSeats[findTrain.Classes.indexOf(Class)],
            Class,
            userId: userInfo.id,
          },
        });
      
        tickets.push(ticket);
      }
      
  
      res.status(200).json({
        message: "Tickets booked successfully",
        tickets,
      });
    } catch (error) {
      console.error("Error in BookTicket:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
}