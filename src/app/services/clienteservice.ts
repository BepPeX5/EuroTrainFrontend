import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prenotazione, Viaggio } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Clienteservice {

  private baseUrl = 'http://localhost:8081/api/clienti';

  constructor(private http: HttpClient) {}

  // Aggiungi il parametro 'authentication'
  prenota(viaggio: Viaggio, posti: number, prezzo: number): Observable<Prenotazione> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('kc_token') || ''}`
    });

    return this.http.post<Prenotazione>(
      `${this.baseUrl}/prenota`,
      { viaggio, posti, prezzo },  // Passiamo viaggio, posti, prezzo
      { headers }
    );
  }
}


