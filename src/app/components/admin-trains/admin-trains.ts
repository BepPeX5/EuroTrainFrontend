import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Viaggioservice } from '../../services/viaggioservice';
import { Trenoservice } from '../../services/trenoservice';
import { Stazioneservice } from '../../services/stazioneservice';
import { Viaggio, Stazione, Treno } from '../../services/models';

@Component({
  standalone: true,
  selector: 'app-admin-trains',
  templateUrl: './admin-trains.html',
  styleUrls: ['./admin-trains.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminTrainsComponent implements OnInit {
  viaggi: Viaggio[] = [];
  nuovoViaggio: Viaggio = this.emptyViaggio();
  modificaId: number | null = null;
  numeroDaGenerare = 3;
  codiciTrenoDisponibili: string[] = [];
  stazioniDisponibili: string[] = [];
  messaggioOperazione: string = '';
  oggi: string = new Date().toISOString().split('T')[0];

  constructor(
    private viaggioService: Viaggioservice,
    private trenoService: Trenoservice,
    private stazioneService: Stazioneservice
  ) {}

  ngOnInit(): void {
    this.caricaViaggi();
    this.caricaCodiciTreno();
    this.caricaStazioni();

    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img, i) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  caricaViaggi(): void {
    this.viaggioService.getAllViaggiAdmin().subscribe(v => this.viaggi = v);
  }

  caricaCodiciTreno(): void {
    this.trenoService.getAllCodiciTreno().subscribe(codici => {
      this.codiciTrenoDisponibili = codici;
    });
  }

  caricaStazioni(): void {
    this.stazioneService.caricaStazioniPartenza().subscribe(stazioni => {
      this.stazioniDisponibili = stazioni;
    });
  }

  salvaNuovoViaggio(): void {
    const codice = this.nuovoViaggio.treno.codice;

    if (!this.codiciTrenoDisponibili.includes(codice)) {
      alert('⚠️ Codice treno non valido.');
      return;
    }

    if (!this.nuovoViaggio.stazionePartenza.nome || !this.nuovoViaggio.stazioneDestinazione.nome) {
      alert('⚠️ Le stazioni devono essere specificate.');
      return;
    }

    if (this.nuovoViaggio.stazionePartenza.nome === this.nuovoViaggio.stazioneDestinazione.nome) {
      alert('⚠️ Le stazioni devono essere diverse.');
      return;
    }


    this.trenoService.getTrenoByCodice(codice).subscribe(treno => {
      if (!treno) {
        alert('❌ Treno non trovato.');
        return;
      }

      this.nuovoViaggio.treno = treno;
      this.nuovoViaggio.disponibilitaPosti = treno.capienza;

      this.viaggioService.creaViaggio(this.nuovoViaggio).subscribe(() => {
        this.nuovoViaggio = this.emptyViaggio();
        this.caricaViaggi();
        this.showSuccessMessage('✅ Viaggio aggiunto con successo.');
      });
    });
  }

  iniziaModifica(viaggio: Viaggio): void {
    this.nuovoViaggio = { ...viaggio };
    this.modificaId = viaggio.id;
  }

  confermaModifica(): void {
    if (this.modificaId !== null) {
      this.viaggioService.aggiornaViaggio(this.modificaId, this.nuovoViaggio).subscribe(() => {
        this.nuovoViaggio = this.emptyViaggio();
        this.modificaId = null;
        this.caricaViaggi();
        this.showSuccessMessage('✅ Modifica completata con successo.');
      });
    }
  }

  elimina(id: number): void {
    if (confirm('Confermi eliminazione viaggio?')) {
      this.viaggioService.eliminaViaggio(id).subscribe(() => {
        this.caricaViaggi();
        this.showSuccessMessage('✅ Viaggio eliminato con successo.');
      });
    }
  }

  generaViaggi(): void {
    this.viaggioService.generaViaggi(this.numeroDaGenerare).subscribe(() => {
      this.caricaViaggi();
      this.showSuccessMessage(`✅ ${this.numeroDaGenerare} Viaggi generati casualmente con successo.`);
    });
  }

  aggiornaDB(): void {
    this.viaggioService.aggiornaDB().subscribe(() => {
      this.showSuccessMessage('✅ Database aggiornato con successo.');
    });
  }

  showSuccessMessage(msg: string): void {
    this.messaggioOperazione = msg;
    setTimeout(() => this.messaggioOperazione = '', 3500);
  }

  formatOrario(ora: string): string {
    return ora?.substring(0, 5);
  }

  emptyViaggio(): Viaggio {
    return {
      id: 0,
      stazionePartenza: this.emptyStazione(),
      stazioneDestinazione: this.emptyStazione(),
      dataPartenza: '',
      orarioPartenza: '',
      disponibilitaPosti: 0,
      prezzo: 0,
      version: 0,
      treno: this.emptyTreno()
    };
  }

  emptyStazione(): Stazione {
    return { codice: '', nome: '', latitudine: 0, longitudine: 0 };
  }

  emptyTreno(): Treno {
    return { id: 0, codice: '', capienza: 0 };
  }
}


