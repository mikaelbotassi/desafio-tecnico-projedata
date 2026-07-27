import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { User, UserPayload } from '../models/user.model';
import { USERS_API_URL, UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpController: HttpTestingController;

  const apiUrl = 'http://localhost:3000/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersApiService,
        { provide: USERS_API_URL, useValue: apiUrl },
      ],
    });

    service = TestBed.inject(UsersApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('deve buscar todos os usuários', () => {
    const users: User[] = [
      {
        id: '1',
        name: 'Ana Souza',
        email: 'ana@email.com',
        cpf: '52998224725',
        phone: '27999991234',
        phoneType: 'MOBILE',
      },
    ];

    service.getAll().subscribe((response) => {
      expect(response).toEqual(users);
    });

    const request = httpController.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(users);
  });

  it('deve cadastrar um usuário', () => {
    const payload: UserPayload = {
      name: 'Bruno Costa',
      email: 'bruno@email.com',
      cpf: '11144477735',
      phone: '2733221100',
      phoneType: 'WORK',
    };

    service.create(payload).subscribe((response) => {
      expect(response.id).toBe('2');
    });

    const request = httpController.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ id: '2', ...payload });
  });

  it('deve atualizar um usuário', () => {
    const payload: UserPayload = {
      name: 'Ana Atualizada',
      email: 'ana@email.com',
      cpf: '52998224725',
      phone: '27999991234',
      phoneType: 'MOBILE',
    };

    service.update('1', payload).subscribe((response) => {
      expect(response.name).toBe('Ana Atualizada');
    });

    const request = httpController.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ id: '1', ...payload });
  });
});
