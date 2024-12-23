// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  contrasena: string = '';
  sueldo_base: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    const userData = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      contrasena: this.contrasena,
      sueldo_base: this.sueldo_base
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert('Error en el registro');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
