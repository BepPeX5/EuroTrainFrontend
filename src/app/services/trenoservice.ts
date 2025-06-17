import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Trenoservice {
  private baseUrl = 'http://localhost:8081/api/treni';

  constructor(private http: HttpClient) {}

  // 🔹 GET /api/treni/codici
  getAllCodiciTreno(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/codici`);
  }
}
