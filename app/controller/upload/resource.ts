import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

import awaitStream = require('await-stream-ready');
import sendToWormhole = require('stream-wormhole');
export default class ResourceController extends Controller {
  public async show() {
    const { ctx } = this;
    ctx.body = { ok: 1 };
  }
  public async upload() {
    const { ctx, app } = this;

    const stream = await ctx.getFileStream();

    const resouceDir = app.config.env === 'local' ? 'resource_dev' : 'resource';

    const newuuid = uuid.v1();

    const target = path.join(process.cwd(), resouceDir, newuuid + path.extname(stream.filename));

    ctx.logger.debug('upload file path: ', target);
    const writeStream = fs.createWriteStream(target);
    const awaitWriteStream = awaitStream.write;
    try {
      await awaitWriteStream(stream.pipe(writeStream));
      ctx.body = { ok: 1 };
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
  }
}

/*
如果用 postman 测试发送文件
只能使用 formdata 方式,
文件字段必须是最后一个字段
const stream = await ctx.getFileStream();
fieldname 为  文件字段名
filename 为 文件原始名

其它字段放在 fields 对象中
*/

/*
fieldname: 'file',
filename: 'cheetah.jpg',
encoding: '7bit',
transferEncoding: '7bit',
mime: 'image/jpeg',
mimeType: 'image/jpeg',
fields: { imageExt: 'png' } }
*/

 /*

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class UploadFormController extends Controller {
  async show() {
    await this.ctx.render('page/form.html');
  }

  async upload() {
    const stream = await this.ctx.getFileStream();
    const filename = encodeURIComponent(stream.fields.name) + path.extname(stream.filename).toLowerCase();
    const target = path.join(this.config.baseDir, 'app/public', filename);
    const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
    this.ctx.redirect('/public/' + filename);
  }
}

module.exports = UploadFormController;
 */