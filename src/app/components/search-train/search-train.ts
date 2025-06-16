import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Stazioneservice } from '../../services/stazioneservice';
import { Viaggioservice } from '../../services/viaggioservice';
import { Viaggio } from '../../services/models';

@Component({
  standalone: true,
  selector: 'app-search-train',
  templateUrl: './search-train.html',
  styleUrls: ['./search-train.css'],
  imports: [CommonModule, FormsModule]
})
export class SearchComponent implements OnInit {
  partenze: string[] = [];
  destinazioni: string[] = [];
  dateDisponibili: string[] = [];

  selectedPartenza: string | null = null;
  selectedDestinazione: string | null = null;
  selectedDataString: string | null = null;

  isLoadingDestinazioni = false;
  isLoadingDate = false;

  constructor(
    private stazioneService: Stazioneservice,
    private viaggioService: Viaggioservice,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.startSlideshow()
    this.stazioneService.caricaStazioniPartenza().subscribe({
      next: (data: string[]) => this.partenze = data,
      error: (err) => console.error('Errore nel caricamento delle partenze:', err)
    });
  }

  onPartenzaChange(): void {
    this.selectedDestinazione = null;
    this.selectedDataString = null;
    this.destinazioni = [];
    this.dateDisponibili = [];

    if (this.selectedPartenza) {
      this.isLoadingDestinazioni = true;
      this.stazioneService.caricaDestinazioniFromPartenza(this.selectedPartenza).subscribe({
        next: (data) => {
          this.destinazioni = data;
          this.isLoadingDestinazioni = false;
        },
        error: () => this.isLoadingDestinazioni = false
      });
    }
  }

  onDestinazioneChange(): void {
    this.selectedDataString = null;
    this.dateDisponibili = [];

    if (this.selectedPartenza && this.selectedDestinazione) {
      this.isLoadingDate = true;
      this.stazioneService.caricaDateDisponibili(this.selectedPartenza, this.selectedDestinazione).subscribe({
        next: (data: string[]) => {
          this.dateDisponibili = data;
          this.isLoadingDate = false;
        },
        error: () => this.isLoadingDate = false
      });
    }
  }

  onDateChange(event: any): void {
    const selected = event.target.value;
    if (
      this.selectedPartenza && this.selectedDestinazione &&
      !this.dateDisponibili.includes(selected)
    ) {
      this.selectedDataString = null;
      alert("La data selezionata non è disponibile per questa tratta.");
    }
  }

  isSearchEnabled(): boolean {
    return (
      (!!this.selectedPartenza && !!this.selectedDestinazione) ||
      (!!this.selectedDataString && !this.selectedPartenza && !this.selectedDestinazione) ||
      (!!this.selectedDataString && !!this.selectedPartenza && !!this.selectedDestinazione)
    );
  }

  onCerca(): void {
    const dataStr = this.selectedDataString;

    if (this.selectedPartenza && this.selectedDestinazione && dataStr) {
      this.viaggioService.cercaPerTrattaEData(this.selectedPartenza, this.selectedDestinazione, dataStr)
        .subscribe(v => this.navigateToResults(v));
    } else if (this.selectedPartenza && this.selectedDestinazione) {
      this.viaggioService.cercaPerTratta(this.selectedPartenza, this.selectedDestinazione)
        .subscribe(v => this.navigateToResults(v));
    } else if (dataStr) {
      this.viaggioService.cercaPerData(dataStr)
        .subscribe(v => this.navigateToResults(v));
    }
  }

  navigateToResults(viaggi: Viaggio[]): void {
    this.router.navigate(['/results'], {state: {viaggi}});
  }

  today(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
    }, 20000); // cambia immagine ogni 8s
  }

  goToAdminLogin(): void {
    this.router.navigate(['/admin']);
  }

}

