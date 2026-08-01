import { Routes } from '@angular/router';
import { Home } from './component/home/home';

import { Inicio } from './component/inicio/inicio';
import { Contactanos } from './component/contactanos/contactanos';
import { Mecanico } from './component/mecanico/mecanico';
import { Reservas } from './component/reservas/reservas';
import { Carrito } from './component/carrito/carrito';
import { Administrador } from './component/administrador/administrador';
import { Compra } from './component/compra/compra';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'inicio', component: Inicio },
  { path: 'contactanos', component: Contactanos },
  { path: 'mecanico', component: Mecanico },
  { path: 'reservas', component: Reservas },
  { path: 'carrito', component: Carrito},
  {path: 'administrador',component: Administrador},
  {path: 'compra',component:Compra}



];