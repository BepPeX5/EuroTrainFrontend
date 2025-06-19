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
    const token = localStorage.getItem('kc_token'); // Verifica token
    if (token) {
      console.log('Utente già loggato, token trovato.');
    } else {
      console.log('Token non trovato, chiedo login.');
    }
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

    // Log dei dati prima di inviarli al backend
    console.log('Prenotazione in procedi:', {
      viaggio: this.viaggio,
      posti: this.posti,
      prezzo: this.viaggio.prezzo! * this.posti
    });
    console.log('Token prima del login:', localStorage.getItem('kc_token'));

    const prenotazione: Prenotazione = {
      viaggio: this.viaggio,
      posti: this.posti,
      prezzo: this.viaggio.prezzo! * this.posti,
      biglietti: []
    };

    // Log per confermare che i dati sono stati preparati correttamente
    console.log('Dati prenotazione preparati per invio:', prenotazione);

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

    // Log prima della chiamata al backend con il token
    console.log('Token di autenticazione prima di inviare la richiesta:', this.keycloakService.getToken());

    this.clienteService.prenota(this.viaggio, this.posti, this.viaggio.prezzo! * this.posti).subscribe({
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




