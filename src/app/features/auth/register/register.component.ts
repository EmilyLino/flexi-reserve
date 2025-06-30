import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../shared/models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  register_form!: FormGroup;
  errorMessage: string = '';
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  )
  {
    this.onForm();
  }

  onForm(){
    this.register_form = this.fb.group({
      user_name: ['',[Validators.required, this.noSpacesValidator]],
      password: ['',[Validators.required]]
    });
  }

  register()
  {
    const data = this.register_form.getRawValue();
    console.log(data);
    if(!this.register_form.valid)
    {
      this.errorMessage = 'Complete los campos correctamente.';
      return;
    }

    //const data = this.register_form.getRawValue();
    const authUser: User = {
      user_name: data.user_name,
      password: data.password
    }

    this.apiService.register(authUser).subscribe({
      next: (res) => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Ocurrio un error en el registro: '+err.error.message;
      }
    });
  }

  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const hasSpaces = /\s/.test(control.value);
    return hasSpaces ? { noSpaces: true } : null;
  }
}
