import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Biglietto, Prenotazione, Viaggio } from './models';

@Injectable({
  providedIn: 'root'
})
export class Prenotazioneservice {

  private baseUrl = 'http://localhost:8081/api/prenotazioni';

  constructor(private http: HttpClient) {}


  getTutteLePrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/prenotazioniComplete`);
  }


  getPrenotazioniPersonali(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/mie`);
  }


  getPrenotazioniPerViaggio(viaggioId: number): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/viaggio/${viaggioId}`);
  }


  haGiaPrenotato(viaggioId: number): Observable<boolean> {
    const params = new HttpParams().set('viaggioId', viaggioId.toString());
    return this.http.get<boolean>(`${this.baseUrl}/verifica`, { params });
  }


  confermaPrenotazione(viaggioId: number): Observable<void> {
    const params = new HttpParams().set('viaggioId', viaggioId.toString());
    return this.http.put<void>(`${this.baseUrl}/conferma`, null, { params });
  }


  aggiungiBiglietti(prenotazione: Prenotazione, biglietti: Biglietto[]): Observable<Prenotazione> {
    const body = {
      prenotazione: prenotazione,
      biglietti: biglietti
    };

    return this.http.post<Prenotazione>(`${this.baseUrl}/aggiungi`, body);
  }



  getListaBiglietti(prenotazione: Prenotazione): Observable<Biglietto[]> {
    return this.http.post<Biglietto[]>(`${this.baseUrl}/listaBiglietti`, prenotazione);
  }


  calcolaPrezzoTotale(prenotazione: Prenotazione): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/prezzoTotale`, prenotazione);
  }

}

