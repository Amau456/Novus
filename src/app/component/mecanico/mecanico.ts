import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mecanico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mecanico.html',
  styleUrl: './mecanico.css'
})
export class Mecanico {

  mensaje = '';

  usuario: any = null;

  reservaSeleccionada: any = null;

  reservas: any[] = [];

  constructor(
    private http: HttpClient
  ) {

    const datosUsuario =
      localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
    }

    this.obtenerReservas();
  }


  /* Obtiene las reservas desde PHP */
  obtenerReservas() {

    this.http
      .get<any[]>(
        'http://localhost/NovusAPI/obtener_reservas.php'
      )
      .subscribe({

        next: (res) => {

          this.reservas = res;

          /*
            Si había una reserva seleccionada,
            buscamos su versión actualizada.
          */
          if (this.reservaSeleccionada) {

            const reservaActualizada =
              this.reservas.find(
                reserva =>
                  reserva.id_reserva ===
                  this.reservaSeleccionada.id_reserva
              );

            this.reservaSeleccionada =
              reservaActualizada || null;
          }

        },

        error: () => {

          this.mostrarMensaje(
            'Error al obtener las reservas'
          );

        }

      });
  }


  /* Guarda la reserva que el usuario seleccionó */
  seleccionarReserva(reserva: any) {

    this.reservaSeleccionada = reserva;

    this.mensaje = '';
  }


  /* Asigna una reserva al mecánico conectado */
  tomarReserva() {

  if (!this.reservaSeleccionada) {
    this.mostrarMensaje('Selecciona una reserva');
    return;
  }

  if (!this.usuario?.id_usuario) {
    this.mostrarMensaje('No se encontró el identificador del mecánico');
    return;
  }

  if (this.reservaSeleccionada.estado !== 'Pendiente') {
    this.mostrarMensaje('Esta reserva ya no está disponible');
    return;
  }

  const datosReserva = {
    id_mecanico: this.usuario.id_usuario,
    id_reserva: this.reservaSeleccionada.id_reserva
  };

  this.http
    .post<any>(
      'http://localhost/NovusAPI/tomar_reserva.php',
      datosReserva
    )
    .subscribe({
      next: (res) => {
        this.mostrarMensaje(res.mensaje);

        if (res.success) {
          this.reservaSeleccionada.estado = 'Ocupada';
          this.reservaSeleccionada.id_mecanico =
            this.usuario.id_usuario;

          this.obtenerReservas();
        }
      },

      error: () => {
        this.mostrarMensaje(
          'Error al conectar con el servidor'
        );
      }
    });
}


  /*
    Método temporal para que el HTML no marque error.

    Después lo conectaremos con:
    finalizar_reserva.php
  */
finalizarReserva() {

  if (!this.reservaSeleccionada) {
    this.mensaje = 'Selecciona una reserva';
    return;
  }

  if (!this.usuario) {
    this.mensaje = 'Debes iniciar sesión';
    return;
  }

  const datos = {
    id_reserva: this.reservaSeleccionada.id_reserva,
    id_mecanico: this.usuario.id_usuario
  };

  console.log(datos);

  this.http
    .post<any>(
      'http://localhost/NovusAPI/finalizar_reserva.php',
      datos
    )
    .subscribe({

      next: (res) => {
        this.mensaje = res.mensaje;

        if (res.success) {
          this.reservaSeleccionada = null;
          this.obtenerReservas();
        }
      },

      error: () => {
        this.mensaje = 'Error al conectar con el servidor';
      }

    });
}

  /* Muestra y limpia los mensajes */
  mostrarMensaje(texto: string) {

    this.mensaje = texto;

    setTimeout(() => {

      this.mensaje = '';

    }, 3500);
  }

}