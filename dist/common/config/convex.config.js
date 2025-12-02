"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("convex/browser");
const convex = new browser_1.ConvexHttpClient(process.env.CONVEX_URL ?? '');
exports.default = convex;
