"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: '.env'
});
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const users_routes_1 = require("./routes/users.routes");
const admin_routes_1 = require("./routes/admin.routes");
const train_routes_1 = require("./routes/train.routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use(users_routes_1.userRouter);
exports.app.use(admin_routes_1.AdminRouter);
exports.app.use(train_routes_1.TrainRouter);
