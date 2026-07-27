import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '@attus/users-data-access';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>;
  let componentRef: ComponentRef<UserCardComponent>;

  const user: User = {
    id: '1',
    name: 'Ana Souza',
    email: 'ana@email.com',
    cpf: '52998224725',
    phone: '27999991234',
    phoneType: 'MOBILE',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [provideEnvironmentNgxMask()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('user', user);
    fixture.detectChanges();
  });

  it('deve exibir nome e e-mail do usuário', () => {
    expect(fixture.nativeElement.textContent).toContain('Ana Souza');
    expect(fixture.nativeElement.textContent).toContain('ana@email.com');
  });

  it('deve emitir o usuário ao clicar em editar', () => {
    const emitSpy = vi.spyOn(fixture.componentInstance.editRequested, 'emit');
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalledWith(user);
  });
});
