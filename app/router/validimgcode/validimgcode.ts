import { Application } from 'egg';

export default (app: Application) => {
  const subRouter = (app.router as any).namespace('/validimgcode');
  subRouter.get('/', app.controller.validimgcode.index.getValidImg);
  subRouter.post('/', app.controller.validimgcode.index.checkValidImgCode);
};
