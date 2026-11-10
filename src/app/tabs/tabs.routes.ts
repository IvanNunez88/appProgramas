import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('../pages/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'alumnos',
        loadComponent: () =>
          import('../pages/alumnos/alumnos.page').then((m) => m.AlumnosPage),
      },
      {
        path: 'maestros',
        loadComponent: () =>
          import('../pages/maestros/maestros.page').then((m) => m.MaestrosPage),
      },
      {
        path: 'carreras',
        loadComponent: () =>
          import('../pages/carreras/carreras.page').then((m) => m.CarrerasPage),
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];
