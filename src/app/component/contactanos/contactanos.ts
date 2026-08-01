import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contactanos.html',
  styleUrl: './contactanos.css',
})
export class Contactanos {
  contacto = {
    nombre: '',
    correo: '',
    mensaje: ''
  };

  enviando = false;
  respuestaServidor = '';

  constructor(private http: HttpClient) {}

  enviarMensaje() {
    if (!this.contacto.nombre || !this.contacto.correo || !this.contacto.mensaje) {
      this.respuestaServidor = 'Por favor llena todos los campos.';
      return;
    }

    this.enviando = true;
    this.respuestaServidor = '';

    // Ruta hacia tu servidor local XAMPP
    this.http.post<any>('http://localhost/Novus/enviar_correo.php', this.contacto)
      .subscribe({
        next: (res) => {
          this.enviando = false;
          if (res.status === 'success') {
            this.respuestaServidor = '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.';
            this.contacto = { nombre: '', correo: '', mensaje: '' }; // Limpiar formulario
          } else {
            this.respuestaServidor = 'Hubo un error al enviar el mensaje.';
          }
        },
        error: (err) => {
          this.enviando = false;
          this.respuestaServidor = 'Error al conectar con el servidor. Verifica que XAMPP esté encendido.';
          console.error('Error:', err);
        }
      });
  }
}