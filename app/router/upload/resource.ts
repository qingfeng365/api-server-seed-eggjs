import { Application } from 'egg';



export default (app: Application) => {
  const subRouter = (app.router as any).namespace('/resource');
  subRouter.post('/', app.controller.upload.resource.upload);
};