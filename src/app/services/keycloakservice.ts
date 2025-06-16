import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";
import { Router } from "@angular/router";

export interface UserProfile {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  token: string;
}

@Injectable({ providedIn: "root" })
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  public profile: UserProfile | undefined;

  private get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: "http://localhost:8080",              // Keycloak URL
        realm: "eurotrain",                        // Nome del realm
        clientId: "backend-treni"                  // Client ID usato sia da frontend che backend
      });
    }
    return this._keycloak;
  }

  constructor(private router: Router) {}

  // Inizializza senza forzare login all'apertura sito
  async init(): Promise<boolean> {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',   // NON forza login subito
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: 'http://localhost:4200/assets/silent-check-sso.html'
    });

    if (authenticated) {
      this.profile = await this.keycloak.loadUserInfo() as unknown as UserProfile;
      this.profile.token = this.keycloak.token || '';

      // Redireziona in base al ruolo se loggato
      if (this.hasRole('Admin')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/prenota']);
      }
    }

    return authenticated;
  }

  // Login volontario per admin (es. clic da bottone)
  loginAsAdmin() {
    this.keycloak.login({
      redirectUri: 'http://localhost:4200/admin-login-callback'
    });
  }

  // Login volontario per utente (es. clic da Prenota)
  loginUtente() {
    this.keycloak.login({
      redirectUri: 'http://localhost:4200/prenota'
    });
  }

  // Restituisce token corrente
  getToken(): string {
    return this.keycloak.token || '';
  }

  // Aggiorna token JWT se sta per scadere
  async updateToken() {
    await this.keycloak.updateToken(30);
  }

  // Ruoli dell'utente (es. Admin o user)
  getUserClientRoles(): string[] {
    return this.keycloak.resourceAccess?.['backend-treni']?.roles || [];
  }

  // Verifica se ha un certo ruolo
  hasRole(role: string): boolean {
    return this.getUserClientRoles().includes(role);
  }

  // Logout con redirect a home
  logout() {
    this.keycloak.logout({
      redirectUri: "http://localhost:4200"
    });
  }
}
