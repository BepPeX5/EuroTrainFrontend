import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Prenotazione} from './models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Clienteservice {

  private baseUrl = 'http://localhost:8081/api/clienti';

  constructor(private http: HttpClient) {}

  // 🔒 Prenotazione (autenticato)
  prenota(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(`${this.baseUrl}/prenota`, prenotazione);
  }

}
