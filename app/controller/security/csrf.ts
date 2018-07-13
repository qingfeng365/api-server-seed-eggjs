import { Controller } from 'egg';

export default class CsrfController extends Controller {
  public async index() {
    const { ctx } = this;

    ctx.body = { info: '/security/csrf 根路由不可以直接使用,要指定下级路由...' };
  }
  public async post() {
    const { ctx } = this;

    ctx.body = { ok: 1 };
  }
}
