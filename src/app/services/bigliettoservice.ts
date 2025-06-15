import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Viaggio} from './models';

@Injectable({
  providedIn: 'root'
})
export class Bigliettoservice {

  private baseUrl = 'http://localhost:8081/api/biglietto';

  constructor(private http: HttpClient) {}

  calcolaPrezzo(dati: { viaggio: Viaggio; tariffa: string }): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/prezzo`, dati);
  }

  getBigliettiUtente(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/utente/${email}`);
  }

  getBigliettiUtentePerData(email: string, data: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/utente/${email}/data`, {
      params: { data }
    });
  }

} //Bigliettoservice
