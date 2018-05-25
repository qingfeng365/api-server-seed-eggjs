import { Application } from 'egg';
import { RedisCatchTool } from '../tools/redis_catch_tool';
import { SequelizeTool } from '../tools/sequelize_tool';
// tslint:disable-next-line:variable-name
const RedisCatchToolSymbol = Symbol('Application#RedisCatchTool');
const sequelizeToolSymbol = Symbol('Application#sequelizeTool');
module.exports = {
  get redisCatchTool(): RedisCatchTool {
    const app: Application = this;
    if (!this[RedisCatchToolSymbol]) {
      this[RedisCatchToolSymbol] = new RedisCatchTool(app);
    }
    return this[RedisCatchToolSymbol];
  },

  get sequelizeTool(): SequelizeTool {
    const app: Application = this;
    if (!this[sequelizeToolSymbol]) {
      this[sequelizeToolSymbol] = new SequelizeTool();
    }
    return this[sequelizeToolSymbol];
  },
};


/* 官方示例
const BAR = Symbol('Application#bar');

module.exports = {
  foo(param) {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
  },
  get bar() {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[BAR]) {
      // 实际情况肯定更复杂
      this[BAR] = this.config.xx + this.config.yy;
    }
    return this[BAR];
  },
};

*/