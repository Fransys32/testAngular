import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GastosService } from '../services/gastos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userId: number = 0;
  sueldoBase: number = 0;
  sueldoDespuesGastos: number = 0;
  
  nuevoGastoLuz: number = 0;
  nuevoGastoAgua: number = 0;
  nuevoGastoDescripcion: string = '';
  nuevoGastoMonto: number = 0;

  porcentajes = {
    recreacion: 0,
    comida: 0,
    ahorros: 0
  };

  saldos = {
    recreacion: 0,
    comida: 0,
    ahorros: 0
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private gastosService: GastosService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUserData();
    if (user) {
      this.userId = user.id;
      this.sueldoBase = user.sueldo_base;
      this.cargarDatos();
    }
  }

  cargarDatos() {
    this.gastosService.obtenerPromediosGastosComunes(this.userId).subscribe(promedios => {
      const gastosComunes = promedios.luz + promedios.agua;
      this.sueldoDespuesGastos = this.sueldoBase - gastosComunes;
    });

    this.gastosService.obtenerPorcentajes(this.userId).subscribe(porcentajes => {
      this.porcentajes = porcentajes;
    });

    this.gastosService.obtenerSaldosDisponibles(this.userId).subscribe(saldos => {
      this.saldos = saldos;
    });
  }

  agregarGastoLuz() {
    if (this.nuevoGastoLuz > 0) {
      this.gastosService.agregarGastoLuz(this.userId, this.nuevoGastoLuz).subscribe({
        next: () => {
          this.nuevoGastoLuz = 0;
          this.cargarDatos();
        },
        error: (error) => console.error('Error al agregar gasto de luz:', error)
      });
    }
  }

  agregarGastoAgua() {
    if (this.nuevoGastoAgua > 0) {
      this.gastosService.agregarGastoAgua(this.userId, this.nuevoGastoAgua).subscribe({
        next: () => {
          this.nuevoGastoAgua = 0;
          this.cargarDatos();
        },
        error: (error) => console.error('Error al agregar gasto de agua:', error)
      });
    }
  }

  agregarGastoAdicional() {
    if (this.nuevoGastoMonto > 0 && this.nuevoGastoDescripcion.trim()) {
      this.gastosService.agregarGastoAdicional(
        this.userId,
        this.nuevoGastoDescripcion,
        this.nuevoGastoMonto
      ).subscribe({
        next: () => {
          this.nuevoGastoDescripcion = '';
          this.nuevoGastoMonto = 0;
          this.cargarDatos();
        },
        error: (error) => console.error('Error al agregar gasto adicional:', error)
      });
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
} 