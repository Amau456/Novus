import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {

  usuario: any = null;

  constructor() {

    const datosUsuario =
      localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
    }

  }

}