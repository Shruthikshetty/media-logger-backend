'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.requireAuth = void 0;
const index_1 = __importDefault(require('../passport/index'));
const config_constants_1 = require('../constants/config.constants');
const handle_error_1 = require('../utils/handle-error');
/**
 * Middleware to require authenticated user.
 * Pass "admin" to require admin-only access.
 */
const requireAuth = (role = 'user') => {
  return (req, res, next) => {
    index_1.default.authenticate('jwt', { session: false }, (err, user) => {
      if (
        err ||
        !user ||
        (role === 'admin' && user.role !== config_constants_1.ADMIN)
      ) {
        (0, handle_error_1.handleError)(res, {
          statusCode: 401,
          message:
            role === 'admin'
              ? 'Unauthorized admin login is required'
              : 'Unauthorized login is required',
        });
        return;
      }
      // Attach user to request
      // @ts-ignore
      req.userData = user;
      next();
    })(req, res, next);
  };
};
exports.requireAuth = requireAuth;
