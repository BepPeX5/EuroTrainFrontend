import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Viaggio, Prenotazione } from '../../services/models';
import { KeycloakService } from '../../services/keycloakservice';
import { Clienteservice } from '../../services/clienteservice';

@Component({
  selector: 'app-riepilogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './riepilogo.html',
  styleUrls: ['./riepilogo.css']
})
export class RiepilogoComponent implements OnInit {
  viaggio: Viaggio | undefined;
  posti: number = 1;
  errorePosti: boolean = false;

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private clienteService: Clienteservice
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { viaggio: Viaggio };
    this.viaggio = state?.viaggio ?? JSON.parse(localStorage.getItem('viaggio') || 'null');
  }

  ngOnInit(): void {
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);

    // ✅ Reinizzializza Keycloak (utile dopo "torna indietro")
    this.keycloakService.init().then(async authenticated => {
      if (authenticated) {
        const profilo: Keycloak.KeycloakProfile = await this.keycloakService.keycloakInstance.loadUserInfo();
        this.keycloakService.profile = {
          sub: '',
          email: profilo['email'] ?? '',
          given_name: profilo['given_name'] ?? '',
          family_name: profilo['family_name'] ?? '',
          token: this.keycloakService.getToken()
        };
      }
    });
  }

  controllaPosti(): void {
    if (!this.viaggio) {
      this.errorePosti = true;
      return;
    }
    this.errorePosti = this.posti > (this.viaggio.disponibilitaPosti ?? 0);
  }

  async procedi(): Promise<void> {
    if (!this.viaggio || this.posti < 1 || this.errorePosti) return;

    const prenotazione: Prenotazione = {
      viaggio: this.viaggio,
      posti: this.posti,
      prezzo: this.viaggio.prezzo! * this.posti,
      biglietti: []
    };

    localStorage.setItem('prenotazione', JSON.stringify(prenotazione));
    localStorage.setItem('posti', this.posti.toString());
    localStorage.setItem('viaggio', JSON.stringify(this.viaggio));
    localStorage.setItem('redirectAfterLogin', '/prenota');

    const isAuthenticated = await this.keycloakService.init();

    if (!isAuthenticated) {
      this.keycloakService.loginUtente();
      return;
    }

    if (!this.keycloakService.hasRole('user')) {
      alert("Accesso negato. Non sei un utente registrato.");
      return;
    }

    // ✅ Chiamata backend
    this.clienteService.prenota(prenotazione).subscribe({
      next: (creata) => {
        this.router.navigate(['/prenota'], {
          state: {
            prenotazione: creata,
            posti: this.posti
          }
        });
      },
      error: (err) => {
        alert("Errore nella creazione della prenotazione. Riprova.");
        console.error(err);
      }
    });
  }
}
