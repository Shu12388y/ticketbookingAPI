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
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_services_1 = require("../services/database.services");
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authTokenCheck = req.headers['authtoken'];
        // Check if the auth token is provided
        if (!authTokenCheck) {
            res.status(401).json({ message: "Auth token is required" });
        }
        // Decode and verify the token
        const secretKey = "secert"; // Replace with your actual secret key
        const decodeToken = jsonwebtoken_1.default.verify(authTokenCheck, secretKey);
        const checkUser = yield database_services_1.prisma.user.findUnique({
            where: {
                email: decodeToken.userData.email
            }
        });
        if (!checkUser) {
            res.status(401).json({ message: "Invalid user token" });
        }
        // @ts-ignore
        req.userInfo = decodeToken.userData;
        console.log(decodeToken.userData);
        // Attach user info to the request object
        // req.userInfo = decodeToken;
        // Proceed to the next middleware or route
        next();
    }
    catch (error) {
        console.error("Error in userMiddleware:", error);
        // Handle JWT-specific errors
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
        // Handle other server errors
        res.status(500).json({ message: "Server error" });
    }
});
exports.userMiddleware = userMiddleware;
