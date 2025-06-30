import { Component, inject, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule, 
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { Area } from '../../../shared/models/area.model';
import {DIALOG_DATA} from '@angular/cdk/dialog';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-area-form',
  imports: [MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.css'
})
export class AreaFormComponent {
  public _areaName: string;
  private _areaDescription: string;
  private _snackBar = inject(MatSnackBar);
  public isEdit: boolean = false;
  public areaToEdit: Area;
  readonly dialogRef = inject(MatDialogRef<AreaFormComponent>);
  loading: boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(@Inject(DIALOG_DATA) public data: {area: Area},
  private apiService: ApiService)
  {
    this._areaName = '';
    this._areaDescription = '';
    this.areaToEdit = { area_description: this._areaDescription, area_name: this._areaName};
    
    if (data) this.setAreaData(data.area);
  }

  public setAreaData(area: Area){
    if(area)
    {
      this.isEdit = true;
      this.areaToEdit = area;
      this.areaDescription = area.area_description;
      this.areaName = area.area_name;
    }
  }

  public set areaDescription(value: string) 
  {
    this._areaDescription = value;
  }

  public get areaDescription()
  {
    return this._areaDescription;
  }

  public set areaName(value: string) 
  {
    this._areaName = value;
  }

  public get areaName()
  {
    return this._areaName;
  }

  validateForm()
  {
    if(this.areaName.trim() == '')
    { 
      return false;
    }

    if(this.areaDescription.trim() == '')
    { 
      return false;
    }

    return true;
  }

  createArea() {

    if(!this.validateForm())
    {
      this._snackBar.open('Por favor llena todos los campos', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5 * 1000,
      });

      return;
    }

    let newArea: Area;
    newArea = {
      area_description: this.areaDescription,
      area_name: this.areaName,
      id_area: null,
      creation_user: null,
      modification_user: null
    };

    this.apiService.saveArea(newArea).subscribe({
      next: () => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this._snackBar.open(err, 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
      },
    });

  }

  editArea(){
    if(!this.validateForm())
    {
      this._snackBar.open('Por favor llena todos los campos', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5 * 1000,
      });

      return;
    }

    this.areaToEdit.area_description = this.areaDescription.trim();
    this.areaToEdit.area_name = this.areaName.trim();

    this.apiService.editArea(this.areaToEdit).subscribe({
      next: () => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log(err);
        this._snackBar.open(err.error.message, 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
      },
    });
  }
}
