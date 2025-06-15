import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";
import { HttpClient } from '@angular/common/http';
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
        url: "http://localhost:8080",
        realm: "eurotrain",
        clientId: "frontend-treni"
      });
    }
    return this._keycloak;
  }

  constructor(private http: HttpClient, private router: Router) {}

  async init(): Promise<boolean> {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso', // NON forza il login all'avvio
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: 'http://localhost:4200/assets/silent-check-sso.html'
    });

    if (authenticated) {
      this.profile = await this.keycloak.loadUserInfo() as unknown as UserProfile;
      this.profile.token = this.keycloak.token || '';
      await this.registerUser();

      // Redirezione solo se si accede da bottone Admin (non forzata all'avvio)
      if (this.hasRole('Admin')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/prenota']);
      }
    }

    return authenticated;
  }

  loginAsAdmin() {
    this.keycloak.login({ redirectUri: 'http://localhost:4200/admin-login-callback' });
  }

  loginUtente() {
    this.keycloak.login({ redirectUri: 'http://localhost:4200/prenota' });
  }

  private async registerUser() {
    if (this.profile) {
      const userDto = {
        email: this.profile.email ?? '',
        firstName: this.profile.given_name ?? '',
        lastName: this.profile.family_name ?? '',
      };

      await this.http.post('http://localhost:8081/api/clienti/register', userDto, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      }).toPromise();
    }
  }

  getToken(): string {
    return this.keycloak.token || '';
  }

  async updateToken() {
    await this.keycloak.updateToken(30);
  }

  getUserClientRoles(): string[] {
    return this.keycloak.resourceAccess?.['frontend-treni']?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserClientRoles().includes(role);
  }

  logout() {
    this.keycloak.logout({ redirectUri: "http://localhost:4200" });
  }
}
