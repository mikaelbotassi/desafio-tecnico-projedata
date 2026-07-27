import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Usuários',
    loadComponent: () =>
      import('./users-page/users-page.component').then(
        (component) => component.UsersPageComponent,
      ),
  },
];
