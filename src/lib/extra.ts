export function hasProperty(obj: object, property: string[] | string) {
  let current = obj;
  if (typeof property === 'string') {
    property = property.split(/\.|\//);
  }
  return property.every((prop) => {
    if (typeof current === 'object' && current.hasOwnProperty(prop)) {
      current = current[prop];
      return true;
    }
    return false;
  });
}
