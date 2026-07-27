import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '@attus/users-data-access';
import { UserFormDialogComponent } from './user-form-dialog.component';

describe('UserFormDialogComponent', () => {
  let fixture: ComponentFixture<UserFormDialogComponent>;
  const close = vi.fn();

  const user: User = {
    id: '1',
    name: 'Ana Souza',
    email: 'ana@email.com',
    cpf: '52998224725',
    phone: '27999991234',
    phoneType: 'MOBILE',
  };

  beforeEach(async () => {
    close.mockReset();

    await TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        provideEnvironmentNgxMask(),
        { provide: MAT_DIALOG_DATA, useValue: { user } },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormDialogComponent);
    fixture.detectChanges();
  });

  it('deve preencher o formulário durante a edição', () => {
    expect(fixture.componentInstance.form.getRawValue()).toEqual({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      phoneType: user.phoneType,
    });
  });

  it('deve fechar retornando o payload quando o formulário for válido', () => {
    fixture.componentInstance.submit();

    expect(close).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      phoneType: user.phoneType,
    });
  });

  it('não deve salvar formulário inválido', () => {
    fixture.componentInstance.form.controls.name.setValue('');
    fixture.componentInstance.submit();

    expect(close).not.toHaveBeenCalled();
  });
});
