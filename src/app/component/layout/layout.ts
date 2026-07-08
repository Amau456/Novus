import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  isLoginOpen = false;
  modo: 'login' | 'registro' = 'login';

  mensaje = '';

  registro = {
    nombre: '',
    ap_pat: '',
    ap_mat: '',
    correo: '',
    telefono: '',
    contrasena: ''
  };

  constructor(private http: HttpClient) {}

  openLogin() {
    this.isLoginOpen = true;
    this.modo = 'login';
    this.mensaje = '';
  }

  closeLogin() {
    this.isLoginOpen = false;
    this.mensaje = '';
  }

  cambiarRegistro() {
    this.modo = 'registro';
    this.mensaje = '';
  }

  cambiarLogin() {
    this.modo = 'login';
    this.mensaje = '';
  }

  registrarUsuario() {
    this.http.post<any>('http://localhost/NovusAPI/registro.php', this.registro)
      .subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;

          if (res.success) {
            this.registro = {
              nombre: '',
              ap_pat: '',
              ap_mat: '',
              correo: '',
              telefono: '',
              contrasena: ''
            };

            this.modo = 'login';
          }
        },
        error: () => {
          this.mensaje = 'Error al conectar con el servidor.';
        }
      });
  }
}