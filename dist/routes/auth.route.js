"use strict";
/**
 * @file contains all the routes related to authentication
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handle_validation_1 = require("../common/middleware/handle-validation");
const login_user_1 = require("../common/validation-schema/auth/login-user");
const auth_controller_1 = require("../controllers/auth.controller");
// initialize router
const route = (0, express_1.Router)();
// login
route.post('/login', (0, handle_validation_1.validateReq)(login_user_1.LoginZodSchema), auth_controller_1.login);
//export all the routes
exports.default = route;
