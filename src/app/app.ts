import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './component/home/home';
import { Layout } from './component/layout/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Novus');
}