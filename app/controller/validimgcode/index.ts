import { Controller } from 'egg';
import captchapng = require('captchapng');
import { RedisCacheGroup, RedisCacheTool } from '../../tools/redis_cache_tool';
export default class IndexController extends Controller {
  cacheGroup: RedisCacheGroup = ((this.app as any)
    .redisCacheTool as RedisCacheTool).createGroup('ValidImgCode');
  public async getValidImg() {
    const { ctx } = this;
    const paramRule = {
      id: 'string',
    };

    // 注意: ctx.validate 默认检查 ctx.body
    ctx.validate(paramRule, ctx.query);
    // const errors = (this.app as any).validator.validate(paramRule, ctx.query);

    const cacheId = ctx.query.id;

    const validValue = parseInt(Math.random() * 9000 + 1000 + '', 10);

    await this.cacheGroup.set(cacheId, validValue, 1000 * 60 * 30);

    ctx.logger.info(`getValidImg validValue: ${cacheId}:${validValue}`);

    const p = new captchapng(80, 30, validValue);
    // width,height,numeric
    p.color(60, 179, 215, 100); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    const img = p.getBase64();
    const imgbase64 = new Buffer(img, 'base64');

    ctx.set('Content-Type', 'image/png');

    ctx.body = imgbase64;
  }
  public async checkValidImgCode() {
    const { ctx } = this;

    const paramRule = {
      id: 'string',
      code: 'string',
    };
    ctx.validate(paramRule);

    const cacheId = ctx.request.body.id;
    const code = ctx.request.body.code;

    ctx.logger.info(`checkValidImgCode cacheId: ${cacheId}, code:${code}`);

    const checkcode = await this.cacheGroup.get(cacheId);

    if (checkcode) {
      if (String(checkcode) === String(code)) {
        ctx.body = {
          ok: true,
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          error: 'invalid code!',
        };
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        error: 'invalid code!',
      };
    }
  }
}
