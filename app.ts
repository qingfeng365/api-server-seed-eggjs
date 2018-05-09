import { Application } from 'egg';

import { dbStructSync } from './app/db_struct_sync/db_struct_sync';

export default (app: Application) => {
  // 注意：在 beforeStart 中不建议做太耗时的操作，框架会有启动的超时检测。
  app.beforeStart(async () => {
    app.logger.info('app.beforeStart...');
    const { mysql } = app as any;
    if (mysql) {
      if (app.config.mysql && app.config.mysql.client && app.config.mysql.client.database ) {
        const dbName = app.config.mysql.client.database;

        dbStructSync.syncDb(dbName, mysql, app.logger);
      }
    }

    // 应用会等待这个函数执行完成才启动
    // await ...

    // 也可以通过以下方式来调用 Service
    // const ctx = app.createAnonymousContext();
    // app.cities = await ctx.service.cities.load();



  });
};
