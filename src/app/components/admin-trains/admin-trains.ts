import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Viaggioservice } from '../../services/viaggioservice';
import { FormsModule } from '@angular/forms';
import {Stazione, Treno, Viaggio} from '../../services/models';

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

  constructor(private viaggioService: Viaggioservice) {}

  ngOnInit(): void {
    this.caricaViaggi();

    // Slideshow automatico (effetto dissolvenza tra immagini)
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img, i) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
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
    return {
      codice: '',
      nome: '',
      latitudine: 0,
      longitudine: 0
    };
  }

  emptyTreno(): Treno {
    return {
      id: 0,
      codice: '',
      capienza: 0
    };
  }

  caricaViaggi(): void {
    this.viaggioService.getAllViaggiAdmin().subscribe(v =>{
      this.viaggi = v});
  }

  generaViaggi(): void {
    this.viaggioService.generaViaggi(this.numeroDaGenerare).subscribe(() => this.caricaViaggi());
  }

  salvaNuovoViaggio(): void {
    this.viaggioService.creaViaggio(this.nuovoViaggio).subscribe(() => {
      this.nuovoViaggio = this.emptyViaggio();
      this.caricaViaggi();
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
      });
    }
  }

  elimina(id: number): void {
    if (confirm('Confermi eliminazione viaggio?')) {
      this.viaggioService.eliminaViaggio(id).subscribe(() => this.caricaViaggi());
    }
  }

  aggiornaDB(): void {
    this.viaggioService.aggiornaDB().subscribe(() => alert('Database aggiornato con successo.'));
  }
}
