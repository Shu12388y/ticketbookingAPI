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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const database_services_1 = require("../services/database.services");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminController {
    static adminSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = yield req.body;
                const findUser = yield database_services_1.prisma.admin.findUnique({
                    where: {
                        email: email
                    }
                });
                if (findUser) {
                    res.status(401).json({ message: "user already exist" });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const apiKeyGenrator = JSON.stringify((yield Math.floor(Math.random() * 100000000)) + 1);
                const adminInfo = yield database_services_1.prisma.admin.create({
                    data: {
                        email: email,
                        password: hashedPassword
                    }
                });
                const apikeyInfo = yield database_services_1.prisma.apiKey.create({
                    data: {
                        adminid: adminInfo.id,
                        apikey: apiKeyGenrator
                    }
                });
                res.status(201).json({ message: "Admin created", apikey: apikeyInfo });
            }
            catch (error) {
                res.status(505).json({ message: "Server Error" });
            }
        });
    }
    static adminSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = yield req.body;
                // @ts-ignore
                const adminEmail = req.adminEmail;
                if (email != adminEmail) {
                    res.status(401).json({ message: "Admin Credentials" });
                }
                if (!email && !password) {
                    res.status(404).json({ message: "Every Field is required" });
                }
                const findUser = yield database_services_1.prisma.admin.findUnique({
                    where: {
                        email
                    },
                    select: {
                        email: true,
                        id: true
                    }
                });
                const userData = new Object(findUser);
                if (!findUser) {
                    res.status(404).json({ messsage: "User not founded" });
                }
                const createToken = yield jsonwebtoken_1.default.sign({ userData }, "adminsecert");
                if (!createToken) {
                    res.status(500).json({ message: "Not able to generate token" });
                }
                res.status(200).json({ message: "success", token: createToken });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.AdminController = AdminController;
