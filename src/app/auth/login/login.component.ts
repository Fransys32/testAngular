import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    const loginData = { email: this.email, contrasena: this.contrasena };
    
    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response.message === 'Login exitoso') {
          console.log('Login exitoso:', response.user);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Error en el login');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
