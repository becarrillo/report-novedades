import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

/** 
 * @description A guard function, wich is used to authorization validation through
 * child routes or/and tokens to allow to users to get into child routes where it's 
 * applied, this is a feature of Angular framework to manage protected routes
 * @returns boolean response when child routes validation has been completed 
 * with permission or not to activate them where it's applied in 'app.routes.ts', 
 * then, if it satisfies conditions allow to user to visit child route's resources
 * */
export const authorizationGuard: CanActivateChildFn = (childRoute, state) => {
  const ROUTER = inject(Router);
  const TOKEN = window.localStorage.getItem('token');
  
  if (
    (childRoute.url.at(0)?.path==='tabla-novedades' || 
    childRoute.url.at(0)?.path==='folders') && 
    (TOKEN===null || TOKEN.length===0)
  ) {
    ROUTER.navigateByUrl('/login');
    return false;
  }

  return TOKEN !== null && TOKEN.length > 0;
};
