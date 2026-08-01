import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Carrito } from '../../services/carrito';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './compra.html',
  styleUrl: './compra.css'
})
export class Compra {

  productos: any[] = [];

  usuario: any = null;

  mensaje = '';

  procesandoCompra = false;

  constructor(
    private carrito: Carrito,
    private http: HttpClient,
    private router: Router
  ) {

    const datosUsuario =
      localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
    }

    this.carrito.compraDirecta$.subscribe(
      productos => {
        this.productos = productos;
      }
    );
  }


  calcularTotal() {

    return this.productos.reduce(
      (total, producto) =>
        total +
        Number(producto.precio_unitario) *
        Number(producto.cantidad),
      0
    );
  }


  finalizarCompra() {

    if (this.procesandoCompra) {
      return;
    }

    if (!this.usuario?.id_usuario) {
      this.mensaje =
        'Debes iniciar sesión para finalizar la compra';
      return;
    }

    if (this.productos.length === 0) {
      this.mensaje =
        'No hay productos para comprar';
      return;
    }

    const datosCompra = {

      id_usuario:
        this.usuario.id_usuario,

      productos:
        this.productos.map(
          producto => ({
            id_refaccion:
              producto.id_refaccion,

            cantidad:
              producto.cantidad
          })
        )

    };

    this.procesandoCompra = true;
    this.mensaje = 'Procesando compra...';

    this.http
      .post<any>(
        'http://localhost/NovusAPI/crear_orden.php',
        datosCompra
      )
      .subscribe({

        next: (res) => {

          this.procesandoCompra = false;
          this.mensaje = res.mensaje;

          if (res.success) {

            this.carrito.vaciarCarrito();

            this.productos = [];

            alert(
              'Compra realizada correctamente\n' +
              'Orden #' + res.id_orden + '\n' +
              'Total: $' + res.total
            );

            this.router.navigate(['/inicio']);
          }

        },

        error: () => {

          this.procesandoCompra = false;

          this.mensaje =
            'Error al conectar con el servidor';

        }

      });
  }

}