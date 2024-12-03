import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

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
