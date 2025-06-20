import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Viaggio} from './models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Viaggioservice {

  private baseUrl = 'http://localhost:8081/api/viaggi';

  constructor(private http: HttpClient) {}


  getViaggioById(id: number): Observable<Viaggio> {
    return this.http.get<Viaggio>(`${this.baseUrl}/${id}`);
  }


  cercaPerTratta(partenza: string, destinazione: string): Observable<Viaggio[]> {
    const params = new HttpParams()
      .set('partenza', partenza)
      .set('destinazione', destinazione);
    return this.http.get<Viaggio[]>(`${this.baseUrl}/tratta`, { params });
  }


  cercaPerData(data: string): Observable<Viaggio[]> {
    const params = new HttpParams().set('data', data);
    return this.http.get<Viaggio[]>(`${this.baseUrl}/data`, { params });
  }


  cercaPerTrattaEData(partenza: string, destinazione: string, data: string): Observable<Viaggio[]> {
    const params = new HttpParams()
      .set('partenza', partenza)
      .set('destinazione', destinazione)
      .set('data', data);
    return this.http.get<Viaggio[]>(`${this.baseUrl}/search`, { params });
  }


  getAllViaggiAdmin(): Observable<Viaggio[]> {
    console.log('📡 Chiamata a getAllViaggiAdmin');
    return this.http.get<Viaggio[]>(`${this.baseUrl}/viaggio`);
  }


  generaViaggi(numero: number): Observable<string> {
    const params = new HttpParams().set('numero', numero.toString());
    return this.http.post(`${this.baseUrl}/genera`, null, { params, responseType: 'text' });
  }


  eliminaViaggio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


  creaViaggio(viaggio: Viaggio): Observable<Viaggio> {
    return this.http.post<Viaggio>(this.baseUrl, viaggio);
  }


  aggiornaViaggio(id: number, viaggio: Viaggio): Observable<Viaggio> {
    return this.http.put<Viaggio>(`${this.baseUrl}/${id}`, viaggio);
  }


  aggiornaDB(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/aggiornaDB`, null);
  }
}
