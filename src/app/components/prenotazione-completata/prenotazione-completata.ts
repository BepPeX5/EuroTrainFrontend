import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successo-prenotazione',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prenotazione-completata.html',
  styleUrls: ['./prenotazione-completata.css']
})
export class PrenotazioneCompletataComponent {

  constructor(private router: Router) {}

  tornaAllaHome(): void {
    this.router.navigate(['/']);
  }

  visualizzaPrenotazioni(): void {
    this.router.navigate(['/recup']);
  }
}
