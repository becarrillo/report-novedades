import { Routes } from '@angular/router';
import { authorizationGuard } from './authorization.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module')
            .then(m => m.DashboardModule),
        canActivateChild: [authorizationGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component')
            .then(m => m.LoginComponent)
    }
];
