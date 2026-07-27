import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserPayload } from '../models/user.model';

export const USERS_API_URL = new InjectionToken<string>('USERS_API_URL', {
  factory: () => 'http://localhost:3000/users',
});

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(USERS_API_URL);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload);
  }

  update(id: string, payload: UserPayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, payload);
  }
}
