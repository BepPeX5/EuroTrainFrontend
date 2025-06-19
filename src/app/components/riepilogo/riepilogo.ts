import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    const token = localStorage.getItem('kc_token');
    if (token) {
      console.log('Utente già loggato, token trovato.');
    } else {
      console.log('Token non trovato, chiedo login.');
    }

    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
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

    const prezzoTotale = this.viaggio.prezzo!;

    localStorage.setItem('prenotazione', JSON.stringify({
      viaggio: this.viaggio,
      posti: this.posti,
      prezzo: prezzoTotale
    }));
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

    // ✅ Chiamata corretta con parametri backend: viaggio nel body, posti/prezzo nei query param
    this.clienteService
      .prenota(this.viaggio, this.posti, prezzoTotale)
      .subscribe({
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
          console.error('Errore durante la creazione della prenotazione:', err);
        }
      });
  }
}

