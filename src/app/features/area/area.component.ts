import { Component, inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AreaFormComponent } from './area-form/area-form.component';
import {MatIconModule} from '@angular/material/icon';
import { Area } from '../../shared/models/area.model';
import { ApiService } from '../../core/services/api.service';
import {MatSnackBarModule, 
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-area',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './area.component.html',
  styleUrl: './area.component.css'
})
export class AreaComponent implements OnInit {
  displayedColumns: string[] = ['no.', 'name', 'description', 'creationUser', 'options'];
  dataSource: Area[] = [];
  readonly dialog = inject(MatDialog);
  areas: Area[] = [];
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private apiService: ApiService,){}

  async ngOnInit() {
    await this.getAreas();
  }
  
  getAreas()
  {
    return new Promise((resolve)=>{
      this.apiService.getAllAreas().subscribe(
        (res)=>{
          this.areas = res.data;
          resolve(true);
        }
      );
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AreaFormComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        await this.getAreas();
      }
    });
  }

  editArea(area: Area) {
    let data = JSON.parse(JSON.stringify(area));
    const dialogRef = this.dialog.open(AreaFormComponent, {
      data: {area: data}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        await this.getAreas();
      }
    });
  }

  deleteArea(id: number)
  {
    this.apiService.deleteArea(id).subscribe({
      next: async () => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        await this.getAreas();
      },
      error: (err) => {
        this._snackBar.open(err.error.message, 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
      },
    });
  }

}
