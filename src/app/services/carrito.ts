import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Carrito {

  private productos: any[] = [];

  private productosSubject =
    new BehaviorSubject<any[]>(this.productos);

  productos$ =
    this.productosSubject.asObservable();

  agregarProducto(refaccion: any) {
    const productoExistente = this.productos.find(
      producto =>
        producto.id_refaccion === refaccion.id_refaccion
    );

    if (productoExistente) {
      if (
        productoExistente.cantidad <
        productoExistente.stock_disponible
      ) {
        productoExistente.cantidad++;
      }
    } else {
      this.productos.push({
        ...refaccion,
        cantidad: 1
      });
    }

    this.productosSubject.next(
      [...this.productos]
    );
  }

  aumentarCantidad(idRefaccion: number) {
    const producto = this.productos.find(
      item => item.id_refaccion === idRefaccion
    );

    if (
      producto &&
      producto.cantidad < producto.stock_disponible
    ) {
      producto.cantidad++;

      this.productosSubject.next(
        [...this.productos]
      );
    }
  }

  disminuirCantidad(idRefaccion: number) {
    const producto = this.productos.find(
      item => item.id_refaccion === idRefaccion
    );

    if (producto && producto.cantidad > 1) {
      producto.cantidad--;

      this.productosSubject.next(
        [...this.productos]
      );
    }
  }

  eliminarProducto(idRefaccion: number) {
    this.productos = this.productos.filter(
      item => item.id_refaccion !== idRefaccion
    );

    this.productosSubject.next(
      [...this.productos]
    );
  }
private compraDirectaSubject =
  new BehaviorSubject<any[]>([]);

compraDirecta$ =
  this.compraDirectaSubject.asObservable();

comprarAhora(refaccion: any) {
  const productoCompra = {
    ...refaccion,
    cantidad: 1
  };

  this.compraDirectaSubject.next([
    productoCompra
  ]);
}

prepararCompra(productos: any[]) {
  this.compraDirectaSubject.next(
    productos.map(producto => ({
      ...producto
    }))
  );
}
}