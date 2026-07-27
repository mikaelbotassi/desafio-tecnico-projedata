import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('@attus/users-feature').then(
        (feature) => feature.USERS_ROUTES,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];
