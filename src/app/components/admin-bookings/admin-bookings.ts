import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prenotazioneservice } from '../../services/prenotazioneservice';
import { FormsModule } from '@angular/forms';
import { Prenotazione, Biglietto } from '../../services/models';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  templateUrl: './admin-bookings.html',
  styleUrls: ['./admin-bookings.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminBookingsComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  dettaglioAperto: number | null = null;
  messaggioOperazione: string = '';

  constructor(private prenotazioneService: Prenotazioneservice) {}

  ngOnInit(): void {
    this.caricaPrenotazioni();


    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img, i) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  caricaPrenotazioni(): void {
    this.prenotazioneService.getTutteLePrenotazioni().subscribe({
      next: (data) => {
        // assegna id fittizio per ogni prenotazione per la gestione dei dettagli
        this.prenotazioni = data.map((p, i) => ({ ...p, id: i }));
      },
      error: (err) => {
        console.error('Errore nel caricamento delle prenotazioni', err);
        this.messaggioOperazione = 'Errore nel caricamento delle prenotazioni.';
      }
    });
  }

  toggleDettagli(prenotazioneId: number): void {
    this.dettaglioAperto = this.dettaglioAperto === prenotazioneId ? null : prenotazioneId;
  }
}

