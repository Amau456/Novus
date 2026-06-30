import { Routes } from '@angular/router';
import { Home } from './component/home/home';

import { Inicio } from './component/inicio/inicio';
import { Contactanos } from './component/contactanos/contactanos';
import { Mecanico } from './component/mecanico/mecanico';
import { Reservas } from './component/reservas/reservas';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'inicio', component: Inicio },
  { path: 'contactanos', component: Contactanos },
  { path: 'mecanico', component: Mecanico },
  { path: 'reservas', component: Reservas },
];