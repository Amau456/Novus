import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Carrito } from '../../services/carrito';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    FormsModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  isLoginOpen = false;
  isCarritoOpen = false;

 modo:
  'login'
  | 'registro'
  | 'verificacion'
  | 'recuperacion'
  = 'login';

  usuario: any = null;

  mensaje = '';

  productosCarrito: any[] = [];

  login = {
    correo: '',
    contrasena: ''
  };

  registro = {
    nombre: '',
    ap_pat: '',
    ap_mat: '',
    correo: '',
    telefono: '',
    contrasena: ''
  };

  verificacion = {
    correo: '',
    token: ''
  };

  constructor(
    private http: HttpClient,
    private carrito: Carrito,
    private router: Router
  ) {

    const datosUsuario =
      localStorage.getItem('usuario');

    if (datosUsuario) {
      this.usuario =
        JSON.parse(datosUsuario);
    }

    this.carrito.productos$
      .subscribe(productos => {
        this.productosCarrito =
          productos;
      });
  }


  

  openLogin() {

    this.isLoginOpen = true;
    this.modo = 'login';
    this.mensaje = '';
  }

  closeLogin() {

    this.isLoginOpen = false;
    this.mensaje = '';
  }

  cambiarRegistro() {

    this.modo = 'registro';
    this.mensaje = '';
  }

  cambiarLogin() {

    this.modo = 'login';
    this.mensaje = '';
  }




  cerrarSesion() {

    localStorage.removeItem('usuario');

    this.usuario = null;

    this.login = {
      correo: '',
      contrasena: ''
    };

    this.mensaje = '';

    window.location.reload();
  }


  iniciarSesion() {

    if (
      this.login.correo.trim() === '' ||
      this.login.contrasena === ''
    ) {
      this.mensaje =
        'Todos los campos son obligatorios';

      return;
    }

    this.http
      .post<any>(
        'http://localhost/NovusAPI/login.php',
        this.login
      )
      .subscribe({

        next: (res) => {

          this.mensaje = res.mensaje;

          /*
            Si el PHP detecta que la cuenta
            todavía no está verificada,
            mostramos directamente el formulario
            para introducir el token.
          */
          if (res.requiere_verificacion) {

            this.verificacion.correo =
              res.correo || this.login.correo;

            this.verificacion.token = '';

            this.modo = 'verificacion';

            return;
          }

          if (res.success) {

            localStorage.setItem(
              'usuario',
              JSON.stringify(res.usuario)
            );

            this.usuario = res.usuario;

            this.login = {
              correo: '',
              contrasena: ''
            };

            this.closeLogin();

            window.location.reload();
          }

        },

        error: () => {

          this.mensaje =
            'Error al conectar con el servidor';

        }

      });
  }


 

  registrarUsuario() {

    if (
      this.registro.nombre.trim() === '' ||
      this.registro.ap_pat.trim() === '' ||
      this.registro.ap_mat.trim() === '' ||
      this.registro.telefono.trim() === '' ||
      this.registro.correo.trim() === '' ||
      this.registro.contrasena === ''
    ) {
      this.mensaje =
        'Todos los campos son obligatorios';

      return;
    }

    /*
      Guardamos el correo antes de limpiar
      el formulario de registro.
    */
    const correoRegistrado =
      this.registro.correo.trim();

    this.http
      .post<any>(
        'http://localhost/NovusAPI/registro.php',
        this.registro
      )
      .subscribe({

        next: (res) => {

          this.mensaje = res.mensaje;

          if (res.success) {

            this.verificacion = {
              correo:
                res.correo || correoRegistrado,

              token: ''
            };

            this.registro = {
              nombre: '',
              ap_pat: '',
              ap_mat: '',
              telefono: '',
              correo: '',
              contrasena: ''
            };

            this.modo =
              'verificacion';
          }

        },

        error: () => {

          this.mensaje =
            'Error al registrar';

        }

      });
  }




  verificarCorreo() {

    if (
      this.verificacion.correo.trim() === '' ||
      this.verificacion.token.trim() === ''
    ) {
      this.mensaje =
        'Ingresa el código de verificación';

      return;
    }

    if (
      !/^[0-9]{6}$/.test(
        this.verificacion.token
      )
    ) {
      this.mensaje =
        'El código debe contener 6 dígitos';

      return;
    }

    this.http
      .post<any>(
        'http://localhost/NovusAPI/verificar_token.php',
        {
          correo:
            this.verificacion.correo.trim(),

          token:
            this.verificacion.token.trim()
        }
      )
      .subscribe({

        next: (res) => {

          this.mensaje = res.mensaje;

          if (res.success) {

            this.login.correo =
              this.verificacion.correo;

            this.login.contrasena = '';

            this.verificacion = {
              correo: '',
              token: ''
            };

            this.modo = 'login';
          }

        },

        error: () => {

          this.mensaje =
            'Error al verificar el correo';

        }

      });
  }


 

  openCarrito() {

    this.isCarritoOpen = true;
  }

  closeCarrito() {

    this.isCarritoOpen = false;
  }

  aumentarCantidad(producto: any) {

    this.carrito.aumentarCantidad(
      producto.id_refaccion
    );
  }

  disminuirCantidad(producto: any) {

    this.carrito.disminuirCantidad(
      producto.id_refaccion
    );
  }

  eliminarProducto(producto: any) {

    this.carrito.eliminarProducto(
      producto.id_refaccion
    );
  }

  calcularTotal() {

    return this.productosCarrito.reduce(
      (total, producto) =>
        total +
        Number(producto.precio_unitario) *
        Number(producto.cantidad),
      0
    );
  }

  procederCompra() {

    if (!this.usuario) {

      this.closeCarrito();
      this.openLogin();

      this.mensaje =
        'Debes iniciar sesión para comprar';

      return;
    }

    if (
      this.productosCarrito.length === 0
    ) {
      this.mensaje =
        'El carrito está vacío';

      return;
    }

    this.carrito.prepararCompra(
      this.productosCarrito
    );

    this.closeCarrito();

    this.router.navigate(['/compra']);
  }

  recuperacion = {
  correo: '',
  token: '',
  nueva_contrasena: ''
};

abrirRecuperacion() {
  this.modo = 'recuperacion';
  this.mensaje = '';

  this.recuperacion = {
    correo: this.login.correo.trim(),
    token: '',
    nueva_contrasena: ''
  };
}


enviarCodigoRecuperacion() {

  if (this.recuperacion.correo.trim() === '') {
    this.mensaje = 'Ingresa tu correo';
    return;
  }

  this.http
    .post<any>(
      'http://localhost/NovusAPI/enviar_token_recuperacion.php',
      {
        correo: this.recuperacion.correo.trim()
      }
    )
    .subscribe({

      next: (res) => {
        this.mensaje = res.mensaje;
      },

      error: () => {
        this.mensaje =
          'Error al enviar el código de recuperación';
      }

    });
}


actualizarContrasena() {

  if (
    this.recuperacion.correo.trim() === '' ||
    this.recuperacion.token.trim() === '' ||
    this.recuperacion.nueva_contrasena === ''
  ) {
    this.mensaje = 'Todos los campos son obligatorios';
    return;
  }

  if (
    !/^[0-9]{6}$/.test(
      this.recuperacion.token.trim()
    )
  ) {
    this.mensaje =
      'El código debe contener 6 dígitos';
    return;
  }

  if (
    this.recuperacion.nueva_contrasena.length < 6
  ) {
    this.mensaje =
      'La contraseña debe contener al menos 6 caracteres';
    return;
  }

  this.http
    .post<any>(
      'http://localhost/NovusAPI/actualizar_contrasena.php',
      {
        correo:
          this.recuperacion.correo.trim(),

        token:
          this.recuperacion.token.trim(),

        nueva_contrasena:
          this.recuperacion.nueva_contrasena
      }
    )
    .subscribe({

      next: (res) => {

        this.mensaje = res.mensaje;

        if (res.success) {

          this.login.correo =
            this.recuperacion.correo;

          this.login.contrasena = '';

          this.recuperacion = {
            correo: '',
            token: '',
            nueva_contrasena: ''
          };

          this.modo = 'login';
        }

      },

      error: () => {
        this.mensaje =
          'Error al actualizar la contraseña';
      }

    });
}



}