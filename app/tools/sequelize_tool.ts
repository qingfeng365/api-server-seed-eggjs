
/**
 * 使用方式
 * 
 * import { SequelizeTool } from '../tools/sequelize_tool'
 * 
 * (app.sequelizeTool as SequelizeTool).classListToNestingArray(...)
 * 
 * 
 */
class SequelizeTool {
  /**
   * classListToNestingArray
   */
  public classListToNestingArray(classlist: any[], option: NestingArrayOp) {
    const op = option || {};
    const itemName = op.itemName || 'Children';
    const codeName = op.codeName || 'classCode';
    const levelName = op.levelName || 'level';
    const parentCodeName = op.parentCodeName || 'classParentCode';

    const resultArray = [];

    let currObj = null;
    let prevItem = null;

    classlist.forEach((item, index, list) => {
      currObj = Object.assign({}, item);
      currObj[itemName] = [];
      item._currlink_ = currObj;

      if (item[levelName] === 1) {
        // 直接增加
        resultArray.push(currObj);

        // item._currlink_ = currObj;
        item._parentlink_ = null;

      } else {
        if (!prevItem) {
          // 这种情况是不合法的,如果prevItem==null,则level===1
        } else {
          if (item[levelName] === (prevItem[levelName] + 1)) {
            // item为prevItem的下级
            prevItem._currlink_[itemName].push(currObj);
            // item._currlink_ = currObj;
            item._parentlink_ = prevItem._currlink_;

          } else if (item[levelName] === prevItem[levelName]) {
            // item为prevItem的兄弟
            if (prevItem._parentlink_) {
              prevItem._parentlink_[itemName].push(currObj);
              // item._currlink_ = currObj;
              item._parentlink_ = prevItem._parentlink_;
            }
          } else if (item[levelName] <= prevItem[levelName]) {
            // item为prevItem父级及父级以上层级的兄弟

            const whereOp = {};
            whereOp[codeName] = item[parentCodeName];
            // const findParentItem = _.findWhere(list, whereOp);
            const findParentItem = list.find((v) => v[codeName] === item[parentCodeName]);

            if (findParentItem) {
              findParentItem._currlink_[itemName].push(currObj);
              // item._currlink_ = currObj;
              item._parentlink_ = findParentItem._currlink_;
            }
          } else {
            //其它情况都是不合法的
          }
        }
      }
      prevItem = item;

    });
    return resultArray;
  }
}

/**
 * 
 * 
 * @interface NestingArrayOp
 * 
 * itemName  嵌套容器属性名
 * codeName  数组元素对象code属性名
 * levelName 数组元素对象level属性名
 * ParentCodeName 数组元素对象parentCode属性名
 * 
 */

interface NestingArrayOp {
  itemName?: string; // 嵌套容器属性名
  codeName?: string; // 数组元素对象code属性名
  levelName?: string; // 数组元素对象level属性名
  parentCodeName?: string; // 数组元素对象parentCode属性名
}
// const sequelizeTool = new SequelizeTool();

export { NestingArrayOp, SequelizeTool }
