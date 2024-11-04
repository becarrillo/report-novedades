import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},
    {path: 'reportes/filtrar', loadComponent: () => import('./components/filter-page/filter-page.component').then(m => m.FilterPageComponent)}
];
