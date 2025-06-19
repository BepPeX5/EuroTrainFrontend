import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prenotazioneservice } from '../../services/prenotazioneservice';
import { Prenotazione } from '../../services/models';

@Component({
  selector: 'app-recup-preno-personali',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recup-preno-personali.html',
  styleUrls: ['./recup-preno-personali.css']
})
export class RecupPrenoPersonaliComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  dettaglioAperto: number | null = null;

  constructor(private prenotazioneService: Prenotazioneservice) {}

  ngOnInit(): void {
    this.prenotazioneService.getPrenotazioniPersonali().subscribe({
      next: (data) => {
        this.prenotazioni = data;
      },
      error: (err) => {
        console.error('Errore nel recupero delle prenotazioni:', err);
      }
    });

    // Slideshow
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  toggleDettagli(prenotazioneId: number): void {
    this.dettaglioAperto = this.dettaglioAperto === prenotazioneId ? null : prenotazioneId;
  }
}
