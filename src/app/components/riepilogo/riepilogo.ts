import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Viaggio, Prenotazione } from '../../services/models';
import { KeycloakService } from '../../services/keycloakservice';
import { Clienteservice } from '../../services/clienteservice';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private clienteService: Clienteservice,
    private snackBar: MatSnackBar
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { viaggio: Viaggio };
    this.viaggio = state?.viaggio ?? JSON.parse(localStorage.getItem('viaggio') || 'null');
  }

  async ngOnInit(): Promise<void> {
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);


    const token = localStorage.getItem('kc_token');
    const isFirstLoad = !sessionStorage.getItem('riepilogo_reentered');
    if (token && isFirstLoad) {
      sessionStorage.setItem('riepilogo_reentered', 'true');
      await this.procedi();
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

    const prezzoTotale = this.viaggio.prezzo!;

    // Salva per eventuale recupero
    localStorage.setItem('prenotazione', JSON.stringify({
      viaggio: this.viaggio,
      posti: this.posti,
      prezzo: prezzoTotale
    }));
    localStorage.setItem('posti', this.posti.toString());
    localStorage.setItem('viaggio', JSON.stringify(this.viaggio));

    const isAuthenticated = await this.keycloakService.init();

    if (!isAuthenticated) {
      sessionStorage.removeItem('riepilogo_reentered');
      this.keycloakService.loginUtente({
        redirectUri: `${window.location.origin}/riepilogo`
      });
      return;
    }

    if (!this.keycloakService.hasRole('user')) {
      alert("Accesso negato. Non sei un utente registrato.");
      return;
    }

    this.clienteService
      .prenota(this.viaggio, this.posti, prezzoTotale)
      .subscribe({
        next: (creata) => {
          console.log('✅ Prenotazione creata con successo:', creata);
          this.router.navigate(['/prenota'], {
            state: {
              prenotazione: creata,
              posti: this.posti
            }
          });
        },
        error: (err) => {
          if (err.status === 500 && err.error?.message?.includes('già effettuato')) {
            this.snackBar.open('Hai già effettuato una prenotazione per questo viaggio.', 'Chiudi', { duration: 3000 });
          } else if (err.status === 410) {
            this.snackBar.open('⏱️ Il tempo per completare la prenotazione è scaduto. Riprova da capo.', 'Chiudi', { duration: 4000 });
            this.router.navigate(['/']); // oppure verso una pagina di riepilogo/errore
          } else {
            this.snackBar.open('❌ Errore durante la prenotazione.', 'Chiudi', { duration: 3000 });
          }
          console.error('❌ Errore durante la creazione della prenotazione:', err);
        }

      });
  }
}

