import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const canMatchPublicGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => {
      if (isAuthenticated) router.navigate(['./']);
    }),
    // Si no esta autenticado, hay que transformar isAuthenticated a true, para que el guard lo deje pasar
    // de otra forma, el guard no deja ver el auth/login debido a que esta restringido, lo que causa una redireccion a 404
    map((isAuthenticated) => !isAuthenticated)
  );
};

export const canActivatePublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => {
      if (isAuthenticated) router.navigate(['./']);
    }),
    map((isAuthenticated) => !isAuthenticated)
  );
};
