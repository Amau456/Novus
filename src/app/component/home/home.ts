import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Al llamarse 'Home' coincidirá con lo que tus rutas ya están buscando automáticamente
}