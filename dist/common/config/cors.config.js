"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
// Express CORS config
exports.corsOptions = {
    origin: (origin, callback) => {
        callback(null, origin); // Dynamically allow any origin @TODO will be fixed when in production with a allow list
    },
    credentials: true,
};
