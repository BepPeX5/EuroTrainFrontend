import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Biglietto, Prenotazione, Viaggio} from './models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Prenotazioneservice {

  private baseUrl = 'http://localhost:8081/api/prenotazioni';

  constructor(private http: HttpClient) {}

  // 🔐 Admin: recupera tutte le prenotazioni
  getTutteLePrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/prenotazioniComplete`);
  }

  // 🔐 Utente autenticato: recupera solo le sue prenotazioni
  getPrenotazioniPersonali(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/mie`);
  }

  // 🔓 Recupera le prenotazioni per un dato viaggio
  getPrenotazioniPerViaggio(viaggioId: number): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/viaggio/${viaggioId}`);
  }

  // 🔐 Verifica se l'utente ha già prenotato quel viaggio
  haGiaPrenotato(viaggioId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verifica`, {
      params: { viaggioId }
    });
  }

  creaPrenotazione(viaggio: Viaggio, posti: number, prezzo: number): Observable<Prenotazione> {
    const params = {
      posti: posti.toString(),
      prezzo: prezzo.toString()
    };

    return this.http.post<Prenotazione>(
      'http://localhost:8081/api/prenotazioni/crea',
      viaggio, // questo è il corpo della richiesta (RequestBody)
      { params } // questi sono i RequestParam
    );
  }

  // 🔐 Aggiunge biglietti a una prenotazione
  aggiungiBiglietti(prenotazione: Prenotazione, biglietti: Biglietto[]): Observable<Prenotazione> {
    const body = { prenotazione, biglietti };
    return this.http.post<Prenotazione>(`${this.baseUrl}/aggiungi`, body);
  }

  // 🔐 Restituisce lista dei biglietti associati
  getListaBiglietti(prenotazione: Prenotazione): Observable<Biglietto[]> {
    return this.http.post<Biglietto[]>(`${this.baseUrl}/listaBiglietti`, prenotazione);
  }

  // 🔐 Calcola il prezzo totale della prenotazione
  calcolaPrezzoTotale(prenotazione: Prenotazione): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/prezzoTotale`, prenotazione);
  }


}
