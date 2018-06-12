
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
