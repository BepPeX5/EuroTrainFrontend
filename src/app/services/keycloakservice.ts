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
  private _keycloak: Keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "eurotrain",
    clientId: "backend-treni"
  });

  public profile: UserProfile | undefined;
  private _initialized = false;

  get isInitialized(): boolean {
    return this._initialized;
  }

  constructor(private router: Router) {}

  async init(): Promise<boolean> {
    if (this._initialized) return this._keycloak.authenticated ?? false;

    try {
      const authenticated = await this._keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        pkceMethod: 'S256'
      });

      this._initialized = true;

      if (authenticated) {
        this.profile = await this._keycloak.loadUserInfo() as UserProfile;
        this.profile.token = this._keycloak.token || '';
        console.log('🪪 Token:', this._keycloak.token);
        console.log('🔓 Ruoli utente:', this.getUserClientRoles());

        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigateByUrl(redirectPath);
        }
      }

      return authenticated;
    } catch (err) {
      console.error('Errore inizializzazione Keycloak:', err);
      return false;
    }
  }

  async loginAsAdmin(): Promise<void> {
    await this._keycloak.login({
      redirectUri: `${window.location.origin}/admin`
    });
  }

  loginUtente(): void {
    const redirect = localStorage.getItem('redirectAfterLogin') || '/';
    this._keycloak.login({
      redirectUri: `${window.location.origin}${redirect}`
    });
  }

  getToken(): string {
    return this._keycloak.token || '';
  }

  getUserClientRoles(): string[] {
    return this._keycloak.resourceAccess?.['backend-treni']?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserClientRoles().includes(role);
  }

  logout(): void {
    this._keycloak.logout({ redirectUri: `${window.location.origin}` });
  }

  get keycloakInstance(): Keycloak {
    return this._keycloak;
  }
}
