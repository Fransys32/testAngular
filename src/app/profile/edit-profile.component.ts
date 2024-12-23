import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface UserData {
  nombre: string;
  apellido: string;
  email: string;
  sueldo_base: number;
  contrasena?: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userId: number = 0;
  userData: UserData = {
    nombre: '',
    apellido: '',
    email: '',
    sueldo_base: 0,
    contrasena: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUserData();
    if (currentUser) {
      this.userId = currentUser.id;
      this.userData = {
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        email: currentUser.email,
        sueldo_base: currentUser.sueldo_base,
        contrasena: ''
      };
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    const updateData = { ...this.userData };
    if (!updateData.contrasena) {
      delete updateData.contrasena;
    }

    this.authService.updateProfile(this.userId, updateData).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify({
          ...response,
          contrasena: undefined
        }));
        
        alert('Perfil actualizado exitosamente');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
} 