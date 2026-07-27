import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { User, UserPayload } from '../models/user.model';
import { UsersApiService } from '../services/users-api.service';
import { UsersStore } from './users.store';

const users: User[] = [
  {
    id: '1',
    name: 'Ana Souza',
    email: 'ana@email.com',
    cpf: '52998224725',
    phone: '27999991234',
    phoneType: 'MOBILE',
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno@email.com',
    cpf: '11144477735',
    phone: '2733221100',
    phoneType: 'WORK',
  },
];

describe('UsersStore', () => {
  const apiMock = {
    getAll: vi.fn(() => of(users)),
    create: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(() => {
    apiMock.getAll.mockReturnValue(of(users));
    apiMock.create.mockReset();
    apiMock.update.mockReset();

    TestBed.configureTestingModule({
      providers: [
        UsersStore,
        {
          provide: UsersApiService,
          useValue: apiMock,
        },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve carregar os usuários ao inicializar', () => {
    const store = TestBed.inject(UsersStore);

    expect(apiMock.getAll).toHaveBeenCalledTimes(1);
    expect(store.users()).toEqual(users);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('deve filtrar usuários após 300ms de debounce', () => {
    vi.useFakeTimers();
    const store = TestBed.inject(UsersStore);

    store.setSearchTerm('Bruno');
    expect(store.searchTerm()).toBe('');

    vi.advanceTimersByTime(300);

    expect(store.searchTerm()).toBe('Bruno');
    expect(store.filteredUsers()).toHaveLength(1);
    expect(store.filteredUsers()[0].name).toBe('Bruno Costa');
  });

  it('deve paginar a lista filtrada', () => {
    const store = TestBed.inject(UsersStore);

    store.setPage({ pageIndex: 1, pageSize: 1 });

    expect(store.paginatedUsers()).toEqual([users[1]]);
  });

  it('deve cadastrar e adicionar o usuário ao estado', () => {
    const store = TestBed.inject(UsersStore);
    const payload: UserPayload = {
      name: 'Camila Lima',
      email: 'camila@email.com',
      cpf: '12345678909',
      phone: '27988887777',
      phoneType: 'MOBILE',
    };

    apiMock.create.mockReturnValue(of({ id: '3', ...payload }));
    store.saveUser({ payload });

    expect(store.users()).toHaveLength(3);
    expect(store.feedback()).toBe('Usuário cadastrado com sucesso.');
    expect(store.saving()).toBe(false);
  });

  it('deve atualizar um usuário existente', () => {
    const store = TestBed.inject(UsersStore);
    const payload: UserPayload = {
      name: 'Ana Atualizada',
      email: users[0].email,
      cpf: users[0].cpf,
      phone: users[0].phone,
      phoneType: users[0].phoneType,
    };

    apiMock.update.mockReturnValue(of({ id: '1', ...payload }));
    store.saveUser({ id: '1', payload });

    expect(store.users()[0].name).toBe('Ana Atualizada');
    expect(store.feedback()).toBe('Usuário atualizado com sucesso.');
  });

  it('deve armazenar mensagem quando o carregamento falhar', () => {
    apiMock.getAll.mockReturnValue(
      throwError(() => new Error('Falha simulada')),
    );

    const store = TestBed.inject(UsersStore);

    expect(store.error()).toBe('Falha simulada');
    expect(store.loading()).toBe(false);
  });
});
