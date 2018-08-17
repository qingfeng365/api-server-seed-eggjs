import { Application } from 'egg';

export default (app: Application) => {
  const checkToken = app.middleware.checkToken();
  const subRouter = (app.router as any).namespace('/api');
  subRouter.get('/', app.controller.api.index.index);
  subRouter.get('/user', app.controller.api.user.count);

  subRouter.post('/auth/login', app.controller.api.auth.login);

  subRouter.get('/auth/work_need_check_token',
    checkToken, app.controller.api.auth.workNeedCheckToken);
  subRouter.post('/auth/work_need_check_token',
    checkToken, app.controller.api.auth.workNeedCheckToken);
  subRouter.get('/addressReceving', app.controller.api.addressreceving.count);
};
