import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { cpfValidator, phoneValidator } from './user.validators';

describe('user validators', () => {
  it('deve aceitar CPF válido', () => {
    const control = new FormControl('529.982.247-25');

    expect(cpfValidator(control)).toBeNull();
  });

  it('deve rejeitar CPF inválido', () => {
    const control = new FormControl('111.111.111-11');

    expect(cpfValidator(control)).toEqual({ cpf: true });
  });

  it('deve aceitar telefone com 10 ou 11 dígitos', () => {
    expect(phoneValidator(new FormControl('(27) 3333-4455'))).toBeNull();
    expect(phoneValidator(new FormControl('(27) 99999-1234'))).toBeNull();
  });

  it('deve rejeitar telefone incompleto', () => {
    const control = new FormControl('279999');

    expect(phoneValidator(control)).toEqual({ phone: true });
  });
});
