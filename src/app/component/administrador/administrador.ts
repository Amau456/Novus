import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador {

Number = Number; 

  /* Usuario conectado */
  usuario: any = null;

  /* Mensajes del sistema */
  mensaje = '';

  /* Listas obtenidas desde PHP */
  proveedores: any[] = [];
  refacciones: any[] = [];

  /* Proveedor seleccionado para consultar sus datos */
  proveedorSeleccionado: any = null;

  /*
    Formulario para registrar un proveedor.
    id_esta comienza en 1 porque representa Activo.
  */
  proveedor = {
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    id_esta: 1
  };

  /*
    Formulario para comprar refacciones.

    Los identificadores comienzan vacíos porque
    se seleccionarán desde los elementos select del HTML.
  */
  compra = {
    id_proveedor: '',
    id_refaccion: '',
    cantidad: '',
    costo_unitario: ''
  };

  constructor(
    private http: HttpClient
  ) {

    const datosUsuario =
      localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
    }

    /*
      Al entrar al componente, cargamos los datos
      necesarios para mostrar los formularios.
    */
    this.obtenerProveedores();
    this.obtenerRefacciones();
  }




  obtenerProveedores() {

    this.http
      .get<any[]>(
        'http://localhost/NovusAPI/obtener_proveedores.php'
      )
      .subscribe({

        next: (res) => {
          this.proveedores = res;
        },

        error: () => {
          this.mostrarMensaje(
            'Error al obtener los proveedores'
          );
        }

      });
  }




  seleccionarProveedor(proveedor: any) {
    this.proveedorSeleccionado = proveedor;
  }




  registrarProveedor() {

    if (
      this.proveedor.nombre.trim() === '' ||
      this.proveedor.telefono.trim() === '' ||
      this.proveedor.correo.trim() === '' ||
      this.proveedor.direccion.trim() === ''
    ) {
      this.mostrarMensaje(
        'Todos los datos del proveedor son obligatorios'
      );

      return;
    }

    this.http
      .post<any>(
        'http://localhost/NovusAPI/crear_proveedor.php',
        this.proveedor
      )
      .subscribe({

        next: (res) => {

          this.mostrarMensaje(res.mensaje);

          if (res.success) {

            /* Limpiar formulario */
            this.proveedor = {
              nombre: '',
              telefono: '',
              correo: '',
              direccion: '',
              id_esta: 1
            };

            /* Actualizar lista */
            this.obtenerProveedores();
          }

        },

        error: () => {
          this.mostrarMensaje(
            'Error al registrar el proveedor'
          );
        }

      });
  }




  obtenerRefacciones() {

    this.http
      .get<any[]>(
        'http://localhost/NovusAPI/obtener_refacciones.php'
      )
      .subscribe({

        next: (res) => {
          this.refacciones = res;
        },

        error: () => {
          this.mostrarMensaje(
            'Error al obtener las refacciones'
          );
        }

      });
  }




  comprarRefaccion() {

    if (
      this.compra.id_proveedor === '' ||
      this.compra.id_refaccion === '' ||
      this.compra.cantidad === '' ||
      this.compra.costo_unitario === ''
    ) {
      this.mostrarMensaje(
        'Todos los datos de la compra son obligatorios'
      );

      return;
    }

    const cantidad =
      Number(this.compra.cantidad);

    const costoUnitario =
      Number(this.compra.costo_unitario);

    if (
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      this.mostrarMensaje(
        'La cantidad debe ser un número entero mayor que cero'
      );

      return;
    }

    if (
      !Number.isFinite(costoUnitario) ||
      costoUnitario <= 0
    ) {
      this.mostrarMensaje(
        'El costo unitario debe ser mayor que cero'
      );

      return;
    }

    /*
      Convertimos los valores del formulario porque
      los select e input normalmente los entregan como texto.
    */
    const datosCompra = {
      id_proveedor:
        Number(this.compra.id_proveedor),

      id_refaccion:
        Number(this.compra.id_refaccion),

      cantidad:
        cantidad,

      costo_unitario:
        costoUnitario,

      id_usuario:
        this.usuario?.id_usuario ?? null
    };

    this.http
      .post<any>(
        'http://localhost/NovusAPI/registrar_compra_proveedor.php',
        datosCompra
      )
      .subscribe({

        next: (res) => {

          this.mostrarMensaje(res.mensaje);

          if (res.success) {

            /* Limpiar formulario de compra */
            this.compra = {
              id_proveedor: '',
              id_refaccion: '',
              cantidad: '',
              costo_unitario: ''
            };

            /*
              Volvemos a obtener las refacciones porque
              el PHP habrá aumentado el stock.
            */
            this.obtenerRefacciones();
          }

        },

        error: () => {
          this.mostrarMensaje(
            'Error al registrar la compra'
          );
        }

      });
  }



  mostrarMensaje(texto: string) {

    this.mensaje = texto;

    setTimeout(() => {
      this.mensaje = '';
    }, 3500);
  }

}