import { Application } from 'egg';

import { Sequelize } from 'sequelize';
import { dbStructSync } from './app/db_struct_sync/db_struct_sync';

export default (app: Application) => {
  // 注意：在 beforeStart 中不建议做太耗时的操作，框架会有启动的超时检测。
  app.beforeStart(async () => {
    const { mysql } = app as any;

    const sequelize: Sequelize = (app as any).model;

    if (mysql) {
      if (app.config.mysql && app.config.mysql.client && app.config.mysql.client.database) {
        const dbName = app.config.mysql.client.database;

        await dbStructSync.syncDb(dbName, mysql, app.logger);
      }
    }

    (app as any).validator.addRule('jsonString', (rule, value) => {
      try {
        JSON.parse(value);
      } catch (err) {
        return 'must be json string';
      }
    });
    (app as any).validator.addRule('queryBoolean', /^(1|0|false|true)$/i);
    (app as any).validator.addRule('queryInt', (rule, value) => {
      try {
        const isInt = /-?[1-9]\d*/.test(value);
        if (isInt) {
          const intValue = parseInt(value, 10);
          if (rule.hasOwnProperty('max') && intValue > rule.max) {
            return `length should smaller than ${rule.max}`;
          }
          if (rule.hasOwnProperty('min') && intValue < rule.min) {
            return `should bigger than ${rule.min}`;
          }

        } else {
          return 'must be integer';
        }
      } catch (error) {
        return 'must be integer';
      }
    });

    // 取消 ,因 egg-sequelize 会自动调用 associate 
    // if (sequelize) {

    //   Object.keys(sequelize.models).forEach((modelName) => {
    //     if ('associate' in sequelize.models[modelName]) {
    //       app.logger.debug('执行 model: ', modelName, ' 的 associate()...');
    //       sequelize.models[modelName].associate(sequelize.models);
    //     }
    //   });

    // }



    // 应用会等待这个函数执行完成才启动
    // await ...

    // 也可以通过以下方式来调用 Service
    // const ctx = app.createAnonymousContext();
    // app.cities = await ctx.service.cities.load();



  });
};
