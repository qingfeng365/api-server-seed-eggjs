import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

const fsPromise = fs.promises;

import awaitStream = require('await-stream-ready');
import sendToWormhole = require('stream-wormhole');
export default class ResourceController extends Controller {
  public async upload() {



    const { ctx, app } = this;

    ctx.logger.debug('app.config.multipart.mode: ', app.config.multipart.mode);
    const mode = app.config.multipart.mode;

    // 使用临时文件模式
    if (mode === 'file') {
      const file = (ctx.request as any).files[0];
      ctx.logger.info(file);

      // file 对象属性
      // {
      //   field: "file",
      //   filename: "bear.jpg",
      //   encoding: "7bit",
      //   mime: "image/jpeg",
      //   filepath: "/x/x/x/e44915b0-1d75-463d-92b7-fe185dcb55b7.jpg"
      // }

      const stat = await fsPromise.stat(file.filepath);
      ctx.logger.info(stat);

      // 复制文件
      // 删除临时文件

      ctx.body = { ok: 1 };
    } else {

      // 使用流模式

      const stream = await ctx.getFileStream();

      const resouceDir = app.config.env === 'local' ? 'resource_dev' : 'resource';

      const newuuid = uuid.v1();

      const target = path.join(process.cwd(), resouceDir, newuuid + path.extname(stream.filename));

      ctx.logger.info('upload:', '\n源:', stream.filename, '\n目标:', target);
      const writeStream = fs.createWriteStream(target);
      const awaitWriteStream = awaitStream.write;

      try {
        await awaitWriteStream(stream.pipe(writeStream));
        ctx.logger.info(target, ' 保存成功.');

        const stat = await fsPromise.stat(target);
        ctx.logger.info(stat);

        ctx.body = { ok: 1 };
      } catch (err) {
        await sendToWormhole(stream);
        throw err;
      }
    }
  }
}
