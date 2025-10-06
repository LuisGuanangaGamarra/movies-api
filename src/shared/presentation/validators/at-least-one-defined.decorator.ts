import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneDefinedClass', async: false })
class AtLeastOneDefinedClassConstraint implements ValidatorConstraintInterface {
  validate(object: any, args: ValidationArguments) {
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

type ClassConstructor<T = any> = new (...args: any[]) => T;

export function AtLeastOneDefined(
  properties: string[],
  options?: ValidationOptions,
) {
  return function (constructor: ClassConstructor) {
    registerDecorator({
      name: 'AtLeastOneDefinedClass',
      target: constructor,
      propertyName: constructor.name,
      constraints: properties,
      options,
      validator: AtLeastOneDefinedClassConstraint,
    });
  };
}
