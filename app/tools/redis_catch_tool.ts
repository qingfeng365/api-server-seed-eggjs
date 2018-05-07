import { Application } from 'egg';

/**
 * 辅助管理缓存分组工具
 * 
 * @class RedisCatchTool
 */
export class RedisCatchTool {
  public groups:any;
  constructor(public app: Application) {
    this.groups = {};
  }

  /**
   * 
   * 创建一个缓存组
   * @param {string} groupName 
   * @returns {RedisCatchGroup} 
   * @memberof RedisCatchTool
   */
  createGroup(groupName: string): RedisCatchGroup {
    if (!this.groups[groupName]){
      this.groups[groupName] = new RedisCatchGroup(this.app, groupName);
    }
    return this.groups[groupName] as RedisCatchGroup;
  }
}

/**
 * 缓存分组
 * 
 * @class RedisCatchGroup
 */
export class RedisCatchGroup {
  constructor(public app: Application, public groupName: string) {

  }


  /**
   * 写入缓存
   * 
   * @param {string} key 键名
   * @param {*} value 值
   * @param {number} [expiremillisecond] 过期时间,可选,毫秒
   * @returns 
   * @memberof RedisCatchGroup
   */
  public async set(key: string, value: any, expiremillisecond?: number) {
    const groupName = this.groupName;

    if (expiremillisecond) {
      return await (this.app as any).redis.set(`${groupName}:${key}`, value, 'PX', expiremillisecond);
    } else {
      return await (this.app as any).redis.set(`${groupName}:${key}`, value);
    }

  }
  public async get(key: string) {
    const groupName = this.groupName;
    return await (this.app as any).redis.get(`${groupName}:${key}`);
  }
}


  /**
   * EX second ：设置键的过期时间为 second 秒。 SET key value EX second 效果等同* 于 SETEX key second value 。
   * PX millisecond ：设置键的过期时间为 millisecond 毫秒。 SET key value PX *millisecond 效果等同于 PSETEX key millisecond value 。
   * NX ：只在键不存在时，才对键进行设置操作。 SET key value NX 效果等同于 SETNX *key value 。
   * XX ：只在键已经存在时，才对键进行设置操作。
   */