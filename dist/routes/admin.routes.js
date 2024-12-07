"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const admin_middleware_1 = require("../middleware/admin.middleware");
exports.AdminRouter = (0, express_1.Router)();
exports.AdminRouter.post("/adminsignup", admin_controller_1.AdminController.adminSignUp);
exports.AdminRouter.post("/adminsignin", admin_middleware_1.adminMiddleware, admin_controller_1.AdminController.adminSignIn);
