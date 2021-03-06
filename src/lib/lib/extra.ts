export function hasProperty(obj: object, property: string[] | string) {
  let current: any = obj;
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

export function joinPath(...args: string[]) {
  return args
    .map((p) => p.replace(/\//g, '.').replace(/^\.|\.$/g, ''))
    .filter((item) => !!item)
    .join('.');
}
