import { Controller } from 'egg';

export default class IndexController extends Controller {
  public async index() {
    const { ctx } = this;

    ctx.body = { info: '/security 根路由不可以直接使用,要指定下级路由...' };
  }
}