/**
 * 转换到 boolean 类型
 *
 * @export
 * @param {*} value
 * @param {boolean} [allowUndefined=false] 可选,值是undefined 时, 返回 undefined
 * @returns {boolean}
 */
export function toBoolean(
  value: any,
  allowUndefined = false,
): boolean {
  const valueStr = ((value as string) || '').toLowerCase();

  if (valueStr === '0' || valueStr === 'false' || valueStr === 'null' || valueStr === '' || value === 0) {
    return false;
  } else if (valueStr === '1' || valueStr === 'true' || value === 1) {
    return true;
  } else {
    return allowUndefined && typeof value === 'undefined'
      ? undefined
      : value != null && `${value}` !== 'false';
  }

}
