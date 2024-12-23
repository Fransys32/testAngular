// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  sueldo_base: number;
  contrasena?: string;
}

interface LoginResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; contrasena: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('isAuthenticated', 'true');
        })
      );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  getCurrentUserData(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  updateProfile(userId: number, userData: Partial<User>): Observable<User> {
    if (userData.contrasena === '') {
      delete userData.contrasena;
    }
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData)
      .pipe(
        tap(response => {
          const currentUser = this.getCurrentUserData();
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            ...response,
            contrasena: undefined
          }));
        })
      );
  }
}
