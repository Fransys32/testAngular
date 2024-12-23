import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GastosComunes {
  luz: number;
  agua: number;
}

interface Porcentajes {
  recreacion: number;
  comida: number;
  ahorros: number;
}

interface SaldosDisponibles {
  recreacion: number;
  comida: number;
  ahorros: number;
}

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  agregarGastoLuz(userId: number, monto: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/boletas-luz`, { usuario_id: userId, monto });
  }

  agregarGastoAgua(userId: number, monto: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/boletas-agua`, { usuario_id: userId, monto });
  }

  agregarGastoAdicional(userId: number, descripcion: string, monto: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/gastos-adicionales`, {
      usuario_id: userId,
      descripcion,
      monto
    });
  }

  obtenerPromediosGastosComunes(userId: number): Observable<GastosComunes> {
    return this.http.get<GastosComunes>(`${this.apiUrl}/gastos-comunes/${userId}`);
  }

  obtenerPorcentajes(userId: number): Observable<Porcentajes> {
    return this.http.get<Porcentajes>(`${this.apiUrl}/porcentajes/${userId}`);
  }

  actualizarPorcentajes(userId: number, porcentajes: Porcentajes): Observable<Porcentajes> {
    return this.http.put<Porcentajes>(`${this.apiUrl}/porcentajes/${userId}`, porcentajes);
  }

  obtenerSaldosDisponibles(userId: number): Observable<SaldosDisponibles> {
    return this.http.get<SaldosDisponibles>(`${this.apiUrl}/saldos/${userId}`);
  }
} 