import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  isLoginOpen = false;
  modo: 'login' | 'registro' = 'login';
  usuario: any = null;
  mensaje = '';

  login = {
    correo: '',
    contrasena: ''
  };

  registro = {
    nombre: '',
    ap_pat: '',
    ap_mat: '',
    correo: '',
    telefono: '',
    contrasena: ''
  };

  constructor(private http: HttpClient) {
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
    }
  }

  openLogin() {
    this.isLoginOpen = true;
    this.modo = 'login';
    this.mensaje = ''; 
  }

  closeLogin() {
    this.isLoginOpen = false;
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.login = { correo: '', contrasena: '' };
    this.mensaje = '';
    window.location.reload();
  }

  cambiarRegistro() {
    this.modo = 'registro';
    this.mensaje = '';
  }

  cambiarLogin() {
    this.modo = 'login';
    this.mensaje = '';
  }

  iniciarSesion() {
    if (this.login.correo === '' || this.login.contrasena === '') {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    this.http.post<any>('http://localhost/NovusAPI/login.php', this.login)
      .subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          if (res.success) {
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            this.usuario = res.usuario;
            this.login = { correo: '', contrasena: '' };
            this.closeLogin();
            window.location.reload();
          }
        },
        error: () => {
          this.mensaje = 'Error al conectar con el servidor';
        }
      });
  }

  registrarUsuario() {
    if (
      this.registro.nombre === '' ||
      this.registro.ap_pat === '' ||
      this.registro.ap_mat === '' ||
      this.registro.telefono === '' ||
      this.registro.correo === '' ||
      this.registro.contrasena === ''
    ) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    this.http.post<any>('http://localhost/NovusApi/registro.php', this.registro)
      .subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          if (res.success) {
            this.registro = {
              nombre: '', ap_pat: '', ap_mat: '',
              telefono: '', correo: '', contrasena: ''
            };
            this.modo = 'login';
          }
        },
        error: () => {
          this.mensaje = 'Error al registrar';
        }
      });
  }
}