import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Prenotazione, Viaggio } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Clienteservice {

  private baseUrl = 'http://localhost:8081/api/clienti';

  constructor(private http: HttpClient) {}

  prenota(viaggio: Viaggio, posti: number, prezzo: number): Observable<Prenotazione> {
    const params = new HttpParams()
      .set('posti', posti.toString())
      .set('prezzo', prezzo.toString());

    return this.http.post<Prenotazione>(
      `${this.baseUrl}/prenota`,
      viaggio,
      { params }
    );
  }

}


