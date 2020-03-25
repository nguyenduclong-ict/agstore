// tslint:disable: no-console
import { joinPath } from './extra';

export function ObjectFunctions(target: any, propertyKey: string | symbol) {
  return;
}
export function AgStoreState(target: any, propertyKey: string | symbol) {
  return;
}

export function formatParams(
  target: object,
  propertyName: string,
  propertyDesciptor: PropertyDescriptor,
): PropertyDescriptor {
  const method = propertyDesciptor.value;
  propertyDesciptor.value = function (...args: any[]) {
    const newArgs = [];
    if (args.length === 1) {
      newArgs.push('');
      newArgs.push(joinPath(args.shift()));
    } else if (arguments.length === 2) {
      newArgs.push(args.shift());
      newArgs.push(joinPath(args.pop()));
    }
    return method.call(this, ...newArgs);
  };
  return propertyDesciptor;
}
