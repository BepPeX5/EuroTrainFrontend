import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Treno} from './models';

@Injectable({
  providedIn: 'root'
})
export class Trenoservice {
  private baseUrl = 'http://localhost:8081/api/treni';

  constructor(private http: HttpClient) {}


  getAllCodiciTreno(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/codici`);
  }


  getTrenoByCodice(codice: string): Observable<Treno> {
    return this.http.get<Treno>(`${this.baseUrl}/${codice}`);
  }
}
