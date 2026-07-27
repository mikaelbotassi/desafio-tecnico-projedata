import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

import {
  SaveUserCommand,
  User,
  UsersPageChange,
} from '../models/user.model';
import { UsersApiService } from '../services/users-api.service';

interface UsersState {
  readonly users: User[];
  readonly loading: boolean;
  readonly saving: boolean;
  readonly error: string | null;
  readonly feedback: string | null;
  readonly searchTerm: string;
  readonly pageIndex: number;
  readonly pageSize: number;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  saving: false,
  error: null,
  feedback: null,
  searchTerm: '',
  pageIndex: 0,
  pageSize: 6,
};

function normalizeText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Não foi possível conectar à API. Confirme se o JSON Server está em execução.';
    }

    if (error.status === 404) {
      return 'O recurso solicitado não foi encontrado.';
    }

    return `A API retornou o erro ${error.status}.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Não foi possível concluir a operação.';
}

export const UsersStore = signalStore(
  withState(initialState),
  withComputed(({ users, searchTerm }) => ({
    filteredUsers: computed(() => {
      const term = normalizeText(searchTerm());

      if (!term) return users();

      return users().filter((user) => normalizeText(user.name).includes(term));
    }),
    totalUsers: computed(() => users().length),
  })),

  withComputed(({ filteredUsers, pageIndex, pageSize }) => ({
    totalFilteredUsers: computed(() => filteredUsers().length),
    paginatedUsers: computed(() => {
      const start = pageIndex() * pageSize();
      const end = start + pageSize();

      return filteredUsers().slice(start, end);
    }),
  })),

  withMethods((store, usersApi = inject(UsersApiService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
            feedback: null,
          });
        }),
        switchMap(() =>
          usersApi.getAll().pipe(
            tap((users) => {
              patchState(store, {
                users,
                loading: false,
                pageIndex: 0,
              });
            }),
            catchError((error: unknown) => {
              patchState(store, {
                loading: false,
                error: getErrorMessage(error),
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    setSearchTerm: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchTerm) => {
          patchState(store, {
            searchTerm,
            pageIndex: 0,
          });
        }),
      ),
    ),

    saveUser: rxMethod<SaveUserCommand>(
      pipe(
        tap(() => {
          patchState(store, {
            saving: true,
            error: null,
            feedback: null,
          });
        }),
        exhaustMap(({ id, payload }) => {
          const request$ = id
            ? usersApi.update(id, payload)
            : usersApi.create(payload);

          return request$.pipe(
            tap((savedUser) => {
              const currentUsers = store.users();
              const alreadyExists = currentUsers.some(
                (user) => user.id === savedUser.id,
              );

              const users = alreadyExists
                ? currentUsers.map((user) =>
                    user.id === savedUser.id ? savedUser : user,
                  )
                : [...currentUsers, savedUser];

              patchState(store, {
                users,
                saving: false,
                feedback: id
                  ? 'Usuário atualizado com sucesso.'
                  : 'Usuário cadastrado com sucesso.',
              });
            }),
            catchError((error: unknown) => {
              patchState(store, {
                saving: false,
                error: getErrorMessage(error),
              });

              return EMPTY;
            }),
          );
        }),
      ),
    ),

    setPage({ pageIndex, pageSize }: UsersPageChange): void {
      patchState(store, {
        pageIndex,
        pageSize,
      });
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  })),

  withHooks({
    onInit(store) {
      store.loadUsers();
    },
  }),
);
