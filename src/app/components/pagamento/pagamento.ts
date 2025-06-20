import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Prenotazione, Biglietto } from '../../services/models';
import { Prenotazioneservice } from '../../services/prenotazioneservice';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento.html',
  styleUrls: ['./pagamento.css']
})
export class PagamentoComponent implements OnInit {
  prenotazione!: Prenotazione;
  biglietti: Biglietto[] = [];
  prezzoTotale: number = 0;

  numeroCarta: string = '';
  meseScadenza: string = '';
  annoScadenza: string = '';
  cvv: string = '';
  errorePagamento: string = '';
  pagamentoCompletato: boolean = false;

  mesi: string[] = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];
  anni: string[] = [];

  constructor(
    private router: Router,
    private prenotazioneService: Prenotazioneservice
  ) {}

  ngOnInit(): void {
    const state = history.state as { prenotazione: Prenotazione };

    if (state?.prenotazione) {
      this.prenotazione = state.prenotazione;
      this.biglietti = this.prenotazione.biglietti || [];
      this.calcolaPrezzoTotale();
    } else {
      this.router.navigate(['/']);
    }


    const annoCorrente = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.anni.push((annoCorrente + i).toString());
    }

    // Sfondo slideshow
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  calcolaPrezzoTotale(): void {
    this.prezzoTotale = this.biglietti.reduce((tot, b) => tot + b.prezzo, 0);
  }

  formattaCarta(): void {
    this.numeroCarta = this.numeroCarta
      .replace(/\D/g, '')
      .substring(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  validaPagamento(): boolean {
    this.errorePagamento = '';

    const regexNumero = /^\d{4} \d{4} \d{4} \d{4}$/;
    const regexCvv = /^[0-9]{3}$/;

    if (!regexNumero.test(this.numeroCarta)) {
      this.errorePagamento = '⚠️ Il numero della carta deve essere nel formato corretto.';
      return false;
    }

    if (!this.meseScadenza || !this.annoScadenza) {
      this.errorePagamento = '⚠️ Selezionare mese e anno di scadenza.';
      return false;
    }

    const mese = parseInt(this.meseScadenza, 10);
    const anno = parseInt(this.annoScadenza, 10);
    const oggi = new Date();
    const dataScadenza = new Date(anno, mese - 1);

    if (dataScadenza < new Date(oggi.getFullYear(), oggi.getMonth(), 1)) {
      this.errorePagamento = '⚠️ La carta è scaduta.';
      return false;
    }

    if (!regexCvv.test(this.cvv)) {
      this.errorePagamento = '⚠️ Il CVV deve contenere esattamente 3 cifre.';
      return false;
    }

    return true;
  }

  confermaPagamento(): void {
    if (!this.validaPagamento()) return;

    const viaggioId = this.prenotazione.viaggio.id;

    this.prenotazioneService.confermaPrenotazione(viaggioId).subscribe({
      next: () => {
        this.pagamentoCompletato = true;
        this.errorePagamento = '';
        console.log('✅ Prenotazione confermata con successo.');

        localStorage.removeItem('prenotazione');
        localStorage.removeItem('posti');

        this.router.navigate(['/prenotazione-completata']);
      },
      error: (err) => {
        this.errorePagamento = '❌ Errore durante la conferma della prenotazione. Riprova.';
        console.error('Errore conferma:', err);
      }
    });
  }

  tornaAllaCompilazione(): void {
    localStorage.setItem('prenotazione', JSON.stringify(this.prenotazione));
    localStorage.setItem('posti', this.prenotazione.posti.toString());

    this.router.navigate(['/prenota'], {
      state: {
        prenotazione: this.prenotazione,
        posti: this.prenotazione.posti
      }
    });
  }
}



