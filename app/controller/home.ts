import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;

    const userCount = await this.ctx.model.User.getCount();

    ctx.body = await ctx.service.test.sayHi('egg' + ' ' + userCount);
  }
}
