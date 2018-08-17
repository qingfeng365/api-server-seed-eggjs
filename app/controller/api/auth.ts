import { Controller } from 'egg';
import { RedisCacheGroup, RedisCacheTool } from '../../tools/redis_cache_tool';
import * as uuid from 'uuid';
export default class AuthController extends Controller {
  cacheGroup: RedisCacheGroup = ((this.app as any)
    .redisCacheTool as RedisCacheTool).createGroup('access_token');
  public async login() {
    const { ctx } = this;
    const paramRule = {
      user: 'string',
      password: 'string',
    };
    ctx.validate(paramRule, ctx.body);
    const user = ctx.request.body.user;
    const password = ctx.request.body.password;

    // 先检查用户是否存在
    if (user !== 'admin') {
      return ctx.throwByUserNotFound();
    }

    // 再检查密码是否正确
    if (password !== 'admin') {
      return ctx.throwByPasswordInvalid();
    }

    const token = uuid.v1();
    const value = {
      userId: 'admin',
      userName: 'admin',
      isAdmin: 1,
      email: 'admin@x.y.z',
    };

    // 如果正确,生成新的 token , 存入缓存, 并返回
    await this.cacheGroup.set(
      token, value, 1000 * 60 * 60 * 24);

    ctx.body = { token, ...value };
  }

  public async workNeedCheckToken() {
    const { ctx } = this;
    ctx.body = { ok: 1 };
  }

}