import { Controller } from 'egg';
import captchapng = require('captchapng');
import { RedisCatchGroup, RedisCatchTool } from '../../tools/redis_catch_tool';
export default class IndexController extends Controller {
  catchGroup: RedisCatchGroup =
    ((this.app as any).redisCatchTool as RedisCatchTool).createGroup('ValidImgCode');
  public async getValidImg() {
    const { ctx } = this;
    const cacheId = ctx.query.id;
    if (cacheId) {
      let validValue = parseInt(Math.random() * 9000 + 1000 + '', 10);

      await this.catchGroup.set(cacheId, validValue, 1000 * 60 * 30);

      // validValue = await this.catchGroup.get(cacheId);

      ctx.logger.info(`getValidImg validValue: ${cacheId}:${validValue}`);

      const p = new captchapng(80, 30, validValue);
      // width,height,numeric
      p.color(60, 179, 215, 100); // First color: background (red, green, blue, alpha)
      p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
      const img = p.getBase64();
      const imgbase64 = new Buffer(img, 'base64');

      ctx.set('Content-Type', 'image/png');

      ctx.body = imgbase64;
    } else {
      ctx.body = '';
    }
  }
  public async checkValidImgCode() {
    const { ctx } = this;
    const cacheId = ctx.request.body.id;
    const code = ctx.request.body.code;

    ctx.logger.info(`checkValidImgCode cacheId: ${cacheId}, code:${code}`);

    const checkcode = await this.catchGroup.get(cacheId);

    if (checkcode) {
      if (String(checkcode) === String(code)) {
        ctx.body = {
          ok: true,
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          error: 'invalid code!'
        };
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        error: 'invalid code!'
      };
    }
  }
}