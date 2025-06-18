import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Viaggio } from '../../services/models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class ResultsComponent {
  viaggi: Viaggio[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { viaggi: Viaggio[] };
    this.viaggi = state?.viaggi || [];
  }

  ngOnInit(): void {
    this.startSlideshow();
  }

  selezionaViaggio(viaggio: Viaggio): void {
    this.router.navigate(['/riepilogo'], { state: { viaggio } });
  }

  startSlideshow(): void {
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let index = 0;
    if (images.length === 0) return;

    images[0].classList.add('active');

    setInterval(() => {
      images[index].classList.remove('active');
      index = (index + 1) % images.length;
      images[index].classList.add('active');
    }, 20000);
  }
}
