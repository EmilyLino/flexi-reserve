import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatListModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  navItems = [
    { name: 'Reservaciones', icon: 'event', route: 'reservaciones' },
    { name: 'Áreas', icon: 'location_on', route: 'areas' },
    { name: 'Horarios', icon: 'schedule', route: 'horarios' }
  ];
  currentTitle: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.url.split('/').pop();
      const match = this.navItems.find(item => item.route === currentRoute);
      this.currentTitle = match ? match.name : 'Dashboard';
    });
  }

  logout()
  {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
