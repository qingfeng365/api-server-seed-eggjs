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
