import { Application } from 'egg';

export default (app: Application) => {
  const subRouter = (app.router as any).namespace('/api');
  subRouter.get('/', app.controller.api.index.index);
  subRouter.get('/user', app.controller.api.user.count);
};
