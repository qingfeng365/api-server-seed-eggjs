import { Controller } from 'egg';

export default class IndexController extends Controller {
  public async getValidImg() {
    const { ctx } = this;
    ctx.body = { info: '/api 根路由不可以直接使用,要指定下级路由...' };
  }
  public async checkValidImgCode() {
    const { ctx } = this;
    ctx.body = { info: '/api 根路由不可以直接使用,要指定下级路由...' };
  }
}