import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas {

  constructor(private http: HttpClient) {}

  /* Objeto para las reservas */
  reserva = {
    id_usuario: null,
    nombre: '',
    telefono: '',
    correo: '',
    marca_vehiculo: '',
    modelo_vehiculo: '',
    anio_vehiculo: '',
    servicio: '',
    descripcion: '',
    fecha: '',
    hora: ''
  };

  mensaje = '';

  /* Método para crear una reserva */
  crearReserva() {

    if (
      this.reserva.nombre === '' ||
      this.reserva.telefono === '' ||
      this.reserva.marca_vehiculo === '' ||
      this.reserva.modelo_vehiculo === '' ||
      this.reserva.anio_vehiculo === '' ||
      this.reserva.servicio === '' ||
      this.reserva.fecha === '' ||
      this.reserva.hora === ''
    ) {
      this.mensaje = 'Todos los campos obligatorios deben llenarse';
      return;
    }

    this.http
      .post<any>(
        'http://localhost/NovusAPI/crear_reserva.php',
        this.reserva
      )
      .subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;

          if (res.success) {
            this.reserva = {
              id_usuario: null,
              nombre: '',
              telefono: '',
              correo: '',
              marca_vehiculo: '',
              modelo_vehiculo: '',
              anio_vehiculo: '',
              servicio: '',
              descripcion: '',
              fecha: '',
              hora: ''
            };
          }

          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        },

        error: () => {
          this.mensaje = 'Error al conectar con el servidor';

          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        }
      });
  }
}