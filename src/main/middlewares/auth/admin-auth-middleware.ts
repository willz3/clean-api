import { adapterMiddleware } from '../../adapters/express/express-middleware-adapter';
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware';

export const withAdminAuth = adapterMiddleware(makeAuthMiddleware('admin'));
