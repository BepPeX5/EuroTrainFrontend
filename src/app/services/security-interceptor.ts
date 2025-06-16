import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from './keycloakservice'; // importa il tuo servizio

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService); // cambia qui

  const bearer = keycloakService.getToken(); // prendi il token

  if (!bearer) {
    return next(req); // se non c’è token, invia la richiesta senza modifiche
  }

  // aggiunge l'header Authorization con Bearer token
  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${bearer}`)
    })
  );
};
