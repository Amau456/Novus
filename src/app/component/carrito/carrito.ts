import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrito as CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {

  usuario: any = null;
  listaProductos: any[] = [];

  constructor(private carritoService: CarritoService) {
    const datosUsuario = localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario);
    }
  }

  ngOnInit(): void {
    // Escucha automáticamente las refacciones agregadas en el servicio
    this.carritoService.productos$.subscribe((productos) => {
      this.listaProductos = productos;
    });
  }

  // Aumentar cantidad de una refacción
  aumentar(idRefaccion: number): void {
    this.carritoService.aumentarCantidad(idRefaccion);
  }

  // Disminuir cantidad
  disminuir(idRefaccion: number): void {
    this.carritoService.disminuirCantidad(idRefaccion);
  }

  // Eliminar un producto
  eliminar(idRefaccion: number): void {
    this.carritoService.eliminarProducto(idRefaccion);
  }

  // Vaciar completamente el carrito (Petición de tu compañero)
  vaciar(): void {
    this.listaProductos.forEach((prod) => {
      this.carritoService.eliminarProducto(prod.id_refaccion);
    });
  }

  // Calcula el Total en dinero (Petición de tu compañero)
  obtenerTotal(): number {
    return this.listaProductos.reduce(
      (total, prod) => total + (prod.precio_unitario || prod.precio || 0) * prod.cantidad,
      0
    );
  }

  // Total de piezas contadas (Petición de tu compañero)
  obtenerTotalPiezas(): number {
    return this.listaProductos.reduce((total, prod) => total + prod.cantidad, 0);
  }

  // Finalizar compra (Petición de tu compañero)
  finalizarCompra(): void {
    if (this.listaProductos.length === 0) return;
    this.carritoService.prepararCompra(this.listaProductos);
    alert('¡Compra registrada con éxito!');
  }
}