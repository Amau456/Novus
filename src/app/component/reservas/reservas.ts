import { Component, OnInit } from '@angular/core';
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
export class Reservas implements OnInit {

  usuario: any = null;

  fechaMinima = '';
  fechaMaxima = '';

  horariosDisponibles: string[] = [];

  mensaje = '';

  enviando = false;

  reserva = {
    id_usuario: null as number | null,
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

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const hoy = new Date();

this.fechaMinima =
  this.formatearFecha(hoy);

const limite = new Date(hoy);

limite.setMonth(
  limite.getMonth() + 1
);

this.fechaMaxima =
  this.formatearFecha(limite);
  }

  formatearFecha(fecha: Date): string {

    const anio =
      fecha.getFullYear();

    const mes =
      String(
        fecha.getMonth() + 1
      ).padStart(2, '0');

    const dia =
      String(
        fecha.getDate()
      ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  generarHorarios(): void {

    this.horariosDisponibles = [];
    this.reserva.hora = '';
    this.mensaje = '';

    if (!this.reserva.fecha) {
      return;
    }

    if (
       this.reserva.fecha >
  this.fechaMaxima
) {
  this.mensaje =
    'Solo puedes reservar con un máximo de un mes de anticipación.';

  this.reserva.fecha = '';

  return;
    }

    const fechaSeleccionada =
      new Date(
        `${this.reserva.fecha}T00:00:00`
      );

    const diaSemana =
      fechaSeleccionada.getDay();

    /*
      Domingo cerrado
    */
    if (diaSemana === 0) {

      this.mensaje =
        'El taller no ofrece servicio los domingos.';

      return;
    }

    /*
      Horario:
      Lunes a viernes: 09:00 a 18:00
      Sábado: 09:00 a 14:00
    */
    const horaInicio = 9;

    const horaFin =
      diaSemana === 6
        ? 14
        : 18;

    const ahora = new Date();

    for (
      let minutos = horaInicio * 60;
      minutos < horaFin * 60;
      minutos += 30
    ) {

      const hora =
        Math.floor(
          minutos / 60
        );

      const minuto =
        minutos % 60;

      const horaTexto =
        `${String(hora).padStart(2, '0')}:` +
        `${String(minuto).padStart(2, '0')}`;

      const fechaHora =
        new Date(
          `${this.reserva.fecha}T${horaTexto}:00`
        );

      /*
        Si la fecha elegida es hoy,
        ocultar horarios que ya pasaron.
      */
      if (
        this.reserva.fecha ===
          this.fechaMinima &&
        fechaHora <= ahora
      ) {
        continue;
      }

      this.horariosDisponibles.push(
        horaTexto
      );
    }

    if (
      this.horariosDisponibles.length === 0
    ) {

      this.mensaje =
        'Ya no hay horarios disponibles para esta fecha.';

    }

  }

  crearReserva(): void {

    if (
  this.reserva.fecha >
  this.fechaMaxima
) {
  this.mensaje =
    'No puedes reservar con más de un mes de anticipación.';

  return;
}

    this.mensaje = '';

    if (
      this.reserva.nombre.trim() === '' ||
      this.reserva.telefono.trim() === '' ||
      this.reserva.marca_vehiculo.trim() === '' ||
      this.reserva.modelo_vehiculo.trim() === '' ||
      this.reserva.anio_vehiculo === '' ||
      this.reserva.servicio === '' ||
      this.reserva.fecha === '' ||
      this.reserva.hora === ''
    ) {

      this.mensaje =
        'Todos los campos obligatorios deben llenarse.';

      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        this.reserva.telefono.trim()
      )
    ) {

      this.mensaje =
        'El teléfono debe contener 10 dígitos.';

      return;
    }

    if (
      this.reserva.correo.trim() !== '' &&
      !this.correoValido(
        this.reserva.correo.trim()
      )
    ) {

      this.mensaje =
        'El correo electrónico no es válido.';

      return;
    }

    const anio =
      Number(
        this.reserva.anio_vehiculo
      );

    const anioActual =
      new Date().getFullYear();

    if (
      !Number.isInteger(anio) ||
      anio < 1950 ||
      anio > anioActual + 1
    ) {

      this.mensaje =
        'El año del vehículo no es válido.';

      return;
    }

    if (
      this.reserva.fecha <
      this.fechaMinima
    ) {

      this.mensaje =
        'No puedes reservar una fecha anterior al día actual.';

      return;
    }

    if (
      !/^\d{2}:(00|30)$/.test(
        this.reserva.hora
      )
    ) {

      this.mensaje =
        'Selecciona un horario válido de 30 minutos.';

      return;
    }

    const datosReserva = {

      id_usuario:
        this.usuario?.id_usuario
          ? Number(
              this.usuario.id_usuario
            )
          : null,

      nombre:
        this.reserva.nombre.trim(),

      telefono:
        this.reserva.telefono.trim(),

      correo:
        this.reserva.correo.trim(),

      marca_vehiculo:
        this.reserva.marca_vehiculo.trim(),

      modelo_vehiculo:
        this.reserva.modelo_vehiculo.trim(),

      anio_vehiculo:
        anio,

      servicio:
        this.reserva.servicio,

      descripcion:
        this.reserva.descripcion.trim(),

      fecha:
        this.reserva.fecha,

      hora:
        this.reserva.hora

    };

    this.enviando = true;

    this.http
      .post<any>(
        'http://localhost/NovusAPI/crear_reserva.php',
        datosReserva
      )
      .subscribe({

        next: (res) => {

          this.enviando = false;

          this.mensaje =
            res.mensaje;

          if (res.success) {

            this.limpiarReserva();

          }

          setTimeout(() => {
            this.mensaje = '';
          }, 4000);

        },

        error: (error) => {

          this.enviando = false;

          this.mensaje =
            error?.error?.mensaje ||
            'Error al conectar con el servidor.';

          setTimeout(() => {
            this.mensaje = '';
          }, 4000);

        }

      });
  }

  limpiarReserva(): void {

    this.reserva = {

      id_usuario:
        this.usuario?.id_usuario
          ? Number(
              this.usuario.id_usuario
            )
          : null,

      nombre:
        this.usuario?.nombre || '',

      telefono:
        this.usuario?.telefono || '',

      correo:
        this.usuario?.correo || '',

      marca_vehiculo: '',
      modelo_vehiculo: '',
      anio_vehiculo: '',
      servicio: '',
      descripcion: '',
      fecha: '',
      hora: ''

    };

    this.horariosDisponibles = [];
  }

  correoValido(correo: string): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(correo);
  }

}