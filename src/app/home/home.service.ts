import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

import { ICita } from '../_shared/models/cita.model';

const baseUrl = `${environment.API_URL}/citas`;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getAll(proximas = true): Observable<ICita[]> {
    return this.http.get<ICita[]>(baseUrl);
  }

  getById(id: string): Observable<ICita> {
    return this.http.get<ICita>(`${baseUrl}/${id}`);
  }

  create(params): Observable<any> {
    return this.http.post(baseUrl, params);
  }

  update(id: string, params): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, params);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
