import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { KeycloakService } from './keycloakservice'; // ✅ tuo servizio attuale
import { isPlatformServer } from '@angular/common';

export interface User {
  id: string;
  email: string;
  name: string;
  bearer: string;
  anonymous: boolean;
}

export const ANONYMOUS_USER: User = {
  id: '',
  email: '',
  name: '',
  bearer: '',
  anonymous: true,
};

@Injectable({ providedIn: 'root' })
export class SecurityStore {
  #keycloakService = inject(KeycloakService);

  loaded = signal(false);
  user = signal<User | undefined>(undefined);

  // 👇🏻 per usare facilmente nei componenti
  loadedUser = computed(() => (this.loaded() ? this.user() : undefined));
  signedIn = computed(() => this.loaded() && !this.user()?.anonymous);

  constructor() {
    this.onInit();
  }

  async onInit() {
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    if (isServer) {
      this.user.set(ANONYMOUS_USER);
      this.loaded.set(true);
      return;
    }

    const isLoggedIn = await this.#keycloakService.init();

    if (isLoggedIn && this.#keycloakService.profile) {
      const { sub, email, given_name, family_name } = this.#keycloakService.profile;
      const user: User = {
        id: sub,
        email,
        name: `${given_name ?? ''} ${family_name ?? ''}`,
        bearer: this.#keycloakService.getToken(),
        anonymous: false,
      };
      this.user.set(user);
    } else {
      this.user.set(ANONYMOUS_USER);
    }

    this.loaded.set(true);
  }

  async signInAsAdmin() {
    await this.#keycloakService.loginAsAdmin();
  }

  async signInAsUser() {
    await this.#keycloakService.loginUtente();
  }

  async signOut() {
    await this.#keycloakService.logout();
  }

  getToken(): string {
    return this.#keycloakService.getToken();
  }

  hasRole(role: string): boolean {
    return this.#keycloakService.hasRole(role);
  }
}
