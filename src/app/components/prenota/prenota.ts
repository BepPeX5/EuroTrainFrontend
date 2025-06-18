import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Prenotazione, Biglietto, Tariffa } from '../../services/models';
import { Prenotazioneservice } from '../../services/prenotazioneservice';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-prenota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prenota.html',
  styleUrls: ['./prenota.css']
})
export class PrenotaComponent implements OnInit {
  prenotazione: Prenotazione | undefined;
  posti: number = 1;
  biglietti: Biglietto[] = [];
  tariffe: Tariffa[] = ['ECONOMY', 'BUSINESS', 'PRIMACLASSE'];
  erroreCampi: string = '';
  erroreConflitto: string = '';
  mostraRiepilogo: boolean = false;
  prezzoTotale: number = 0;

  constructor(
    private router: Router,
    private prenotazioneService: Prenotazioneservice
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { prenotazione: Prenotazione, posti: number };
    this.prenotazione = state?.prenotazione;
    this.posti = state?.posti;

    this.inizializzaBiglietti();
  }

  ngOnInit(): void {
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  inizializzaBiglietti(): void {
    if (!this.prenotazione) return;

    this.biglietti = Array.from({ length: this.posti }, () => ({
      nomePasseggero: '',
      cognomePasseggero: '',
      dataNascita: '',
      tariffa: 'ECONOMY',
      prezzo: this.prenotazione!.prezzo,
      stazionePartenza: this.prenotazione!.viaggio.stazionePartenza.nome,
      stazioneArrivo: this.prenotazione!.viaggio.stazioneDestinazione.nome,
      dataViaggio: this.prenotazione!.viaggio.dataPartenza,
      orarioViaggio: this.prenotazione!.viaggio.orarioPartenza
    }));
  }

  aggiornaPrezzo(index: number): void {
    const moltiplicatori: Record<Tariffa, number> = {
      'ECONOMY': 1.0,
      'BUSINESS': 1.5,
      'PRIMACLASSE': 2.0
    };
    const base = this.prenotazione!.prezzo;
    this.biglietti[index].prezzo = base * moltiplicatori[this.biglietti[index].tariffa as Tariffa];
  }

  verificaValiditaBiglietti(): boolean {
    const soloLettere = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

    return this.biglietti.every(b =>
      soloLettere.test(b.nomePasseggero.trim()) &&
      soloLettere.test(b.cognomePasseggero.trim()) &&
      b.dataNascita.trim().length > 0
    );
  }

  procediPagamento(): void {
    if (!this.prenotazione || !this.verificaValiditaBiglietti()) {
      this.erroreCampi = 'Inserire tutti i dati dei passeggeri correttamente prima di proseguire.';
      return;
    }

    this.erroreCampi = '';
    this.erroreConflitto = '';

    this.prenotazioneService.aggiungiBiglietti(this.prenotazione, this.biglietti).subscribe({
      next: (aggiornata) => {
        this.prenotazione = aggiornata;
        this.calcolaPrezzoTotale();
        this.mostraRiepilogo = true;
      },
      error: (err) => {
        if (err.status === 500) {
          this.erroreConflitto = '⚠️ Il viaggio è stato aggiornato. Riprova a fare la prenotazione.';
        } else {
          console.error('Errore aggiunta biglietti:', err);
        }
      }
    });
  }

  calcolaPrezzoTotale(): void {
    this.prenotazioneService.calcolaPrezzoTotale(this.prenotazione!).subscribe({
      next: (totale) => {
        this.prezzoTotale = totale;
      },
      error: (err) => {
        console.error('Errore nel calcolo del prezzo totale:', err);
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/']);
  }
}
