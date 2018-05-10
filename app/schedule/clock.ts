import egg = require('egg');
import { Application } from 'egg';
const Subscription = (egg as any).Subscription;

import * as moment from 'moment';

export default class ClockTask extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1h', // 1小时 [https://github.com/zeit/ms]
      type: 'all', // 指定所有的 worker 都需要执行
      immediate: true, // 要在应用启动并 ready 后立刻执行一次这个定时任务
      disable: false, // 不启动
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;
    const app: Application = ctx.app;

    app.logger.info('现在服务器的时间是:' + moment().format('YYYY-MM-DD hh:mm:ss:SSS'));
  }
}