import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successo-prenotazione',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prenotazione-completata.html',
  styleUrls: ['./prenotazione-completata.css']
})
export class PrenotazioneCompletataComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Slideshow
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  tornaAllaHome(): void {
    this.router.navigate(['/']);
  }

  visualizzaPrenotazioni(): void {
    this.router.navigate(['/recup-preno-personali']);
  }
}
