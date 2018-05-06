import { Application } from 'egg';
export default (app: Application) => {
  // 注意：在 beforeStart 中不建议做太耗时的操作，框架会有启动的超时检测。
  app.beforeStart(async () => {
    app.logger.info('app.beforeStart...');
    // 应用会等待这个函数执行完成才启动
    // await ...

    // 也可以通过以下方式来调用 Service
    // const ctx = app.createAnonymousContext();
    // app.cities = await ctx.service.cities.load();
  });
};
