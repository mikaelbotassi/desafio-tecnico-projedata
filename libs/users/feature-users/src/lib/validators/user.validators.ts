import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function onlyDigits(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '');
}

export const cpfValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const cpf = onlyDigits(control.value);

  if (!cpf) {
    return null;
  }

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { cpf: true };
  }

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
    : { cpf: true };
};

export const phoneValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const phone = onlyDigits(control.value);

  if (!phone) {
    return null;
  }

  return phone.length === 10 || phone.length === 11
    ? null
    : { phone: true };
};
