import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {

  busqueda = '';

  refaccionesFiltradas: any[] = [];

  usuario: any = null;

  refaccionSeleccionada: any = null;

  refacciones: any[] = [];

  constructor(private http: HttpClient) {

    const datosUsuario = localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
      console.log(this.usuario);
    }

    this.obtenerRefacciones();
  }

  obtenerRefacciones() {

    this.http
      .get<any[]>('http://localhost/NovusAPI/obtener_refacciones.php')
      .subscribe({

        next: (res) => {

          this.refacciones = res;

          this.refaccionesFiltradas = res;

        },

        error: () => {
          console.log('Error al obtener las refacciones');
        }

      });
  }

  buscarRefacciones() {

    const texto = this.busqueda.toLowerCase().trim();

    this.refaccionesFiltradas = this.refacciones.filter(
      refaccion =>
        refaccion.nombre_pieza
          .toLowerCase()
          .includes(texto)
    );

  }

  seleccionarRefaccion(refaccion: any) {

    this.refaccionSeleccionada = refaccion;

  }

}
