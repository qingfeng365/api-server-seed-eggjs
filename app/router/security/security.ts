import { Application } from 'egg';

export default (app: Application) => {
  const subRouter = (app.router as any).namespace('/security');
  subRouter.get('/', app.controller.security.index.index);
  subRouter.get('/csrf', app.controller.security.csrf.index);
  subRouter.post('/csrf/post', app.controller.security.csrf.post);
};
