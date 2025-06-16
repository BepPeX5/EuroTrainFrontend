import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Stazioneservice {

  private baseUrl = 'http://localhost:8081/api/stazioni';

  constructor(private http: HttpClient) {}

  caricaStazioniPartenza(): Observable<string[]>{
    return this.http.get<string[]>(`${this.baseUrl}/partenze`);
  }

  // Chiamata a GET /api/stazioni/destinazioni?stazionePartenza=...
  caricaDestinazioniFromPartenza(partenza: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/destinazioni`, {
      params: { stazionePartenza: partenza }
    });
  }

  // Chiamata a GET /api/stazioni/partenza?stazionePartenza=...&stazioneDestinazione=...
  caricaDateDisponibili(partenza: string, destinazione: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/partenza`, {
      params: {
        stazionePartenza: partenza,
        stazioneDestinazione: destinazione
      }
    });
  }

} //Stazioneservice
