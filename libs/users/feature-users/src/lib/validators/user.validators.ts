import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';

function onlyDigits(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '');
}

export function cpfValidator(path: SchemaPath<string>):void {
  validate(path, ({ value }) => {
    const cpfError = {
      kind: 'cpfError',
      message: 'Digite um CPF válido'
    };

    const cpf = onlyDigits(value());

    if (!cpf) return null;

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return cpfError;

    const calculateDigit = (length: number): number => {
      let sum = 0;

      for (let index = 0; index < length; index += 1) {
        sum += Number(cpf[index]) * (length + 1 - index);
      }

      const remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };

    const firstDigit = calculateDigit(9);
    const secondDigit = calculateDigit(10);

    return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
      ? null
      : cpfError;
  });
}

export const phoneValidator = (path:SchemaPath<string>): void => {
  validate(path, ({value}) => {
    const phone = onlyDigits(value());

    if (!phone) return null;

    return phone.length === 10 || phone.length === 11
      ? null
      : { kind:'phoneError', message: 'Digite um número de telefone válido' };
    });
};
