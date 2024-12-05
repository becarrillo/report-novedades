import { Routes } from '@angular/router';
import { authorizationGuard } from './authorization.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: window.localStorage.getItem('token')?.length!==undefined && window.localStorage.getItem('token')!.length>=1 ? 'dashboard' : 'login',
        pathMatch: 'full'
    },
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
