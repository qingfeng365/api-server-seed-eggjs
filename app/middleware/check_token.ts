import { Context } from 'egg';
import { RedisCacheGroup, RedisCacheTool } from '../tools/redis_cache_tool';
module.exports = options => {

  return async function checkToken(ctx: Context, next) {

    const cacheGroup: RedisCacheGroup = ((ctx.app as any)
      .redisCacheTool as RedisCacheTool).createGroup('access_token');

    let token = null;
    if (ctx.request.header && ctx.request.header.token) {
      token = ctx.request.header.token;
    } else if (ctx.request.query && ctx.request.query.token) {
      token = ctx.request.query.token;
    } else if (ctx.request.body && ctx.request.body.token) {
      token = ctx.request.body.token;
    }

    if (token != null && typeof token === 'string' && token.length > 0) {
      ctx.logger.info('token:', token);

      const accessToken = await cacheGroup.get(token);
      if (!accessToken) {
        // token 不存在,或过期
        ctx.status = 401;
        ctx.body = {
          code: 'unauthorized',
          message: '身份验证错误',
          errors: [{
            message: '无效或过期的 token ',
            field: 'token',
            code: 'invalid_token',
          }],
        };
      } else {
        await next();
      }

    } else {
      // 没有提供 token

      ctx.status = 401;
      ctx.body = {
        code: 'unauthorized',
        message: '身份验证错误',
        errors: [{
          message: '没有提供 token ',
          field: 'token',
          code: 'missing_token',
        }],
      };
    }
  }
}
