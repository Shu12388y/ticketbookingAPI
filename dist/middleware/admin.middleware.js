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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const database_services_1 = require("../services/database.services");
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminapikey = req.headers['apikey'];
        if (!adminapikey) {
            return res.status(401).json({ message: "Api key is missing" });
        }
        const searchapiKey = yield database_services_1.prisma.apiKey.findFirst({
            where: {
                apikey: adminapikey
            }
        });
        if (!searchapiKey) {
            res.status(404).json({ message: "API key not founded" });
        }
        const findadminId = searchapiKey === null || searchapiKey === void 0 ? void 0 : searchapiKey.adminid;
        const findUser = yield database_services_1.prisma.admin.findFirst({
            where: {
                id: findadminId
            }
        });
        if (!findUser) {
            res.status(404).json({ message: "Admin Not Found" });
        }
        // @ts-ignore
        req.adminEmail = findUser === null || findUser === void 0 ? void 0 : findUser.email;
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.adminMiddleware = adminMiddleware;
