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
  imports: [CommonModule, FormsModule],
})
export class SearchComponent implements OnInit {
  partenze: string[] = [];
  destinazioni: string[] = [];
  dateDisponibili: string[] = [];

  selectedPartenza: string | null = null;
  selectedDestinazione: string | null = null;
  selectedData: string | null = null;

  isLoadingDestinazioni = false;
  isLoadingDate = false;

  constructor(
    private stazioneService: Stazioneservice,
    private viaggioService: Viaggioservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stazioneService.caricaStazioniPartenza().subscribe({
      next: (data: string[]) => {
        this.partenze = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento delle partenze:', err);
      }
    });
  }

  onPartenzaChange(): void {
    this.selectedDestinazione = null;
    this.selectedData = null;
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
    this.selectedData = null;
    this.dateDisponibili = [];

    if (this.selectedPartenza && this.selectedDestinazione) {
      this.isLoadingDate = true;
      this.stazioneService.caricaDateDisponibili(this.selectedPartenza, this.selectedDestinazione).subscribe({
        next: (data) => {
          this.dateDisponibili = data;
          this.isLoadingDate = false;
        },
        error: () => this.isLoadingDate = false
      });
    }
  }

  isSearchEnabled(): boolean {
    return (!!this.selectedPartenza && !!this.selectedDestinazione) || !!this.selectedData;
  }

  onCerca(): void {
    if (this.selectedPartenza && this.selectedDestinazione && this.selectedData) {
      this.viaggioService.cercaPerTrattaEData(this.selectedPartenza, this.selectedDestinazione, this.selectedData)
        .subscribe(v => this.navigateToResults(v));
    } else if (this.selectedPartenza && this.selectedDestinazione) {
      this.viaggioService.cercaPerTratta(this.selectedPartenza, this.selectedDestinazione)
        .subscribe(v => this.navigateToResults(v));
    } else if (this.selectedData) {
      this.viaggioService.cercaPerData(this.selectedData)
        .subscribe(v => this.navigateToResults(v));
    }
  }

  navigateToResults(viaggi: Viaggio[]): void {
    this.router.navigate(['/results'], { state: { viaggi } });
  }

  today(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Funzione che ritorna true solo se la data è selezionabile
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    const yyyyMMdd = date.toISOString().split('T')[0]; // Formato 'yyyy-MM-dd'
    return this.dateDisponibili.includes(yyyyMMdd) && date >= new Date(this.today());
  };
}

