import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import setupSwagger from './swagger';
import setupStaticFiles from './static-files';

const app = express();
setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);
setupStaticFiles(app);

export default app;
