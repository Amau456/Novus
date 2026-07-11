import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-layout',
  standalone: true,

  /*
    CommonModule permite usar directivas como *ngIf.
    RouterLink permite navegar con routerLink.
    RouterOutlet muestra el componente de la ruta activa.
  */
  imports: [CommonModule, RouterLink, RouterOutlet,FormsModule],

  templateUrl: './layout.html',
  styleUrl: './layout.css'
})

export class Layout {
  /*Modal que controla si abre o cierra */
  isLoginOpen = false;
 
  /*Como el formulario se mostrara */
  modo:'login'|'registro'='login';
 
  usuario: any = null;
  /*Se crea un objeto */
  login = {

    correo: '',

    contrasena: ''

  };
   
  mensaje = '';

registro ={
  nombre:'',
  ap_pat:'',
  ap_mat:'',
  correo:'',
  telefono:'',
  contrasena:''
};

  /*Constructor  */
constructor(private http: HttpClient) {

  const datosUsuario = localStorage.getItem('usuario');

  if (datosUsuario) {
    this.usuario = JSON.parse(datosUsuario);
  }

}

  /*Abre el login */
  openLogin() {
    this.isLoginOpen = true;
    this.modo = 'login';
    this.mensaje = ''; 
  }



  /*Cierra el login */
  closeLogin() {
    this.isLoginOpen = false;

  }
  cerrarSesion() {

  /* Elimina los datos guardados */
  localStorage.removeItem('usuario');

  /* El usuario deja de existir en Angular */
  this.usuario = null;

  /* Limpia el formulario de login */
  this.login = {
    correo: '',
    contrasena: ''
  };

  /* Limpia cualquier mensaje */
  this.mensaje = '';

}
  cambiarRegistro(){
    this.modo = 'registro';
    this.mensaje = '';
  }
  cambiarLogin(){
    this.modo = 'login';
    this.mensaje='';
  }


iniciarSesion(){

  if (
/*Comprobacion si esta vacia la casilla */
this.login.correo === '' ||
/*Comrpobacion si la casilla esta vacia con comprobacion */
this.login.contrasena === ''

  ){
    this.mensaje = 'Todos los campos son obligatorios'
   return;
  }
  /*Usa la herramienta httpclient */
  this.http
  /*Peticion de tipo post y la direccion donde los recibe */  
  .post<any>('http://localhost/NovusAPI/login.php',
    /*Objeto  */  
    this.login
    )
    /*Ejecuta la peticion y  obtiene respuesta */
   .subscribe({
    /*Responde cuando php es true */
      next: (res) => {
        /*Guarda el mensaje */
        this.mensaje = res.mensaje;
        /*Si el login fue correcto */
        if (res.success) {

  /* Guarda los datos del usuario en el navegador */
  localStorage.setItem(
    'usuario',

    /* Convierte el objeto en texto */
    JSON.stringify(res.usuario)
  );

  /* Guarda al usuario también en la variable de Angular */
  this.usuario = res.usuario;

  /* Limpia los campos del login */
  this.login = {
    correo: '',
    contrasena: ''
  };

  /* Cierra el modal */
  this.closeLogin();
}
      },

      error: () => {

        this.mensaje = 'Error al conectar con el servidor';

      }

    });
}

registrarUsuario(){
  /*Verifica que ningun campo este vacio */
  if(
    this.registro.nombre === ''||
    this.registro.ap_pat === ''||
    this.registro.ap_mat === ''||
    this.registro.telefono === ''||
    this.registro.correo === ''||
    this.registro.contrasena === ''

  ){
    this.mensaje = 'Todos los campos son obligatorios';
    return;

  }
  /*Envie el registro */
  this.http
  .post<any>(
    'http://localhost/NovusApi/registro.php',
    this.registro
  )
.subscribe({
  /*Llega a php y responde */
  next:(res) =>{
    this.mensaje = res.mensaje;
    /*Si el registro fue correcto */
    if(res.success){
      this.registro= {
        nombre:'',
        ap_pat:'',
        ap_mat:'',
        telefono:'',
        correo:'',
        contrasena:''
      };
      this.modo ='login';
    }
  },
  /*Si no fue posible */
  error:()=>{
  this.mensaje = 'Error al registrar';
  }
});


}
}

























