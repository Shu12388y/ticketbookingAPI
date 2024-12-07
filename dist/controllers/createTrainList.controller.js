"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrainList = void 0;
const database_services_1 = require("../services/database.services");
const redis_services_1 = require("../services/redis.services");
class CreateTrainList {
    static createTrainList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, trainNumber, Departure, Arrival, TotalSeats, NumbersofClasses, Classes, NumberofSeats, PricesofSeats, DepartureTiming, ArrivalTiming, } = yield req.body;
                const findTrain = yield database_services_1.prisma.createTrainJourneyDetail.findUnique({
                    where: {
                        trainNumber: trainNumber,
                    },
                });
                if (findTrain) {
                    res.status(400).json({ message: "Train already exist" });
                }
                yield database_services_1.prisma.createTrainJourneyDetail.create({
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
                const handleNumberOfSeats = yield redis_services_1.redis.set(`TotalSeats:${trainNumber}`, TotalSeats);
                const expireNumberOfSeats = yield redis_services_1.redis.expire(`TotalSeats:${trainNumber}`, 60 * 60);
                for (let i = 0; i < Classes.length; i++) {
                    yield redis_services_1.redis.set(`${Classes[i]}:${trainNumber}`, NumberofSeats[i]);
                }
                for (let i = 0; i < Classes.length; i++) {
                    yield redis_services_1.redis.expire(`${Classes[i]}:${trainNumber}`, 60 * 60);
                }
                res.status(201).json({ message: "Train Journey Create" });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static updateTrainList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainNumber } = req.params;
                const findTrain = yield database_services_1.prisma.createTrainJourneyDetail.findUnique({
                    where: {
                        trainNumber: parseInt(trainNumber),
                    },
                });
                if (!findTrain) {
                    res.status(404).json({ message: "Train doesn't Exist" });
                }
                const updateTrainData = yield req.body;
                yield database_services_1.prisma.createTrainJourneyDetail.update({
                    where: {
                        trainNumber: parseInt(trainNumber),
                    },
                    data: Object.assign({}, updateTrainData),
                });
                res.status(200).json({ message: "Train detail updated" });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static deleteTrainList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainNumber } = yield req.params;
                yield database_services_1.prisma.createTrainJourneyDetail.delete({
                    where: {
                        trainNumber: parseInt(trainNumber),
                    },
                });
                res.status(200).json({ message: "Deleted the train detail" });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static getAllTraindetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield database_services_1.prisma.createTrainJourneyDetail.findMany();
                if (!data) {
                    res.status(404).json({ message: "No data available" });
                }
                res.status(200).json({ data: data });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static getParticularTrain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Arrival, Departure } = req.query;
                const findTheTrain = yield database_services_1.prisma.createTrainJourneyDetail.findMany({
                    where: {
                        Arrival: Arrival,
                        Departure: Departure,
                    },
                });
                if (!findTheTrain) {
                    res.status(404).json({ mesage: "No Train available" });
                }
                console.log(Arrival, Departure);
                console.log(findTheTrain);
                const responseData = yield Promise.all(findTheTrain.map((train) => __awaiter(this, void 0, void 0, function* () {
                    const classesWithSeats = yield Promise.all(train.Classes.map((className, index) => __awaiter(this, void 0, void 0, function* () {
                        const redisKey = `${className}:${train.trainNumber}`;
                        const checkSeats = yield redis_services_1.redis.get(redisKey);
                        return {
                            class: className,
                            numberofSeats: checkSeats || "N/A", // Fallback if Redis key is missing
                        };
                    })));
                    const { Classes, NumberofSeats, TotalSeats } = train, trainDetails = __rest(train, ["Classes", "NumberofSeats", "TotalSeats"]);
                    return Object.assign(Object.assign({}, trainDetails), { classesWithSeats });
                })));
                console.log("Transformed Train Details:", responseData);
                // Send the response
                res.status(200).json({ data: responseData });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static BookTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { trainNumber } = req.params;
                // @ts-ignore
                const userInfo = req.userInfo;
                const { Class, numberOfSeats } = req.body;
                if (!trainNumber || !Class || !numberOfSeats) {
                    return res.status(400).json({ message: "Invalid input data" });
                }
                const findTrain = yield database_services_1.prisma.createTrainJourneyDetail.findUnique({
                    where: { trainNumber: parseInt(trainNumber) },
                });
                if (!findTrain) {
                    return res.status(404).json({ message: "Train not found" });
                }
                if (!findTrain.Classes.includes(Class)) {
                    return res
                        .status(400)
                        .json({ message: `Class ${Class} not available on this train` });
                }
                const redisKey = `${Class}:${trainNumber}`;
                console.log(redisKey);
                const availableSeats = yield redis_services_1.redis.get(redisKey);
                console.log(availableSeats);
                if (!availableSeats || parseInt(availableSeats) < numberOfSeats) {
                    return res
                        .status(400)
                        .json({ message: "Insufficient seats available" });
                }
                yield redis_services_1.redis.set(redisKey, parseInt(availableSeats) - numberOfSeats);
                const totalSeatKey = `TotalSeats:${trainNumber}`;
                const getTotalSeats = yield redis_services_1.redis.get(totalSeatKey);
                if (!getTotalSeats || parseInt(getTotalSeats) <= 0) {
                    return res.status(400).json({ message: "No seats are available" });
                }
                yield redis_services_1.redis.set(totalSeatKey, parseInt(getTotalSeats) - parseInt(numberOfSeats));
                // Generate PNR number
                // Create tickets
                let tickets = [];
                for (let i = 0; i < numberOfSeats; i++) {
                    const generatePNRNumber = Math.floor(Math.random() * 1000000) + 1;
                    const redisKey = `${Class}:${trainNumber}`;
                    const maxSeats = yield redis_services_1.redis.get(redisKey);
                    if (!maxSeats || parseInt(maxSeats) <= 0) {
                        return res
                            .status(400)
                            .json({ message: "No seats available in the selected class" });
                    }
                    const seatNumber = Math.floor(Math.random() * parseInt(maxSeats)) + 1;
                    // Create a ticket in PostgreSQL
                    const ticket = yield database_services_1.prisma.ticketDetails.create({
                        data: {
                            PNRNumber: generatePNRNumber,
                            NameOfTrain: findTrain.name,
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
                    yield redis_services_1.redis.set(redisKey, parseInt(maxSeats) - 1);
                }
                res.status(200).json({
                    message: "Tickets booked successfully",
                    tickets,
                });
            }
            catch (error) {
                console.error("Error in BookTicket:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.CreateTrainList = CreateTrainList;
