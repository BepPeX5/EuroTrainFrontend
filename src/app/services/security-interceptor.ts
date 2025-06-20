import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from './keycloakservice';

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService); // cambia qui

  const bearer = keycloakService.getToken(); // prendi il token

  if (!bearer) {
    return next(req); // se non c’è token, invia la richiesta senza modifiche
  }

  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${bearer}`)
    })
  );
};
