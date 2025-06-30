import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../shared/models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.errorMessage = '';

    if (this.username.trim() == '' || this.password.trim() == '') {
      this.errorMessage = 'Por favor, ingresa el usuario y la contraseña.';
      return;
    }

    const authUser: User = {
      user_name: this.username,
      password: this.password
    }

    this.apiService.login(authUser).subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('user_name', this.username);
        this.router.navigate(['/home/reservaciones']);
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
