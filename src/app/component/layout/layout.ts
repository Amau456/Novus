import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {


  isLoginOpen = false;

  openLogin(): void {
    console.log('ABRIENDO MODAL');
    this.isLoginOpen = true;
  }


  closeLogin(): void {
    console.log('CERRANDO MODAL');
    this.isLoginOpen = false;
  }

}