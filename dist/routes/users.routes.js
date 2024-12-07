"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/usersignup", users_controller_1.UserController.userSignUp);
exports.userRouter.post("/usersignin", users_controller_1.UserController.userSignIn);
