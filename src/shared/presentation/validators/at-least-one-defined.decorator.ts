import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneDefinedClass', async: false })
class AtLeastOneDefinedClassConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object;
    if (!object || typeof object !== 'object') return false;
    const properties = args.constraints as string[];
    return properties.some((prop) => {
      const value = (object as Record<string, unknown>)[prop];
      return value !== null && value !== undefined && value !== '';
    });
  }

  defaultMessage(args: ValidationArguments) {
    const props = args.constraints as string[];
    return `Debe estar definido al menos uno de los siguientes campos: ${props.join(', ')}`;
  }
}

export function AtLeastOneDefined(
  properties: string[],
  options?: ValidationOptions,
) {
  return function (constructor: new (...args: any[]) => object) {
    registerDecorator({
      name: 'AtLeastOneDefinedClass',
      target: constructor,
      propertyName: '',
      constraints: properties,
      options,
      validator: AtLeastOneDefinedClassConstraint,
    });
  };
}
